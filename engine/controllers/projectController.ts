import * as fs from "fs";
import * as path from 'path';
import * as yaml from "js-yaml";
import * as _ from "lodash";

import { FunctionDefinition,
    ProjectDefinition,
    FunctionType,
    trace,
    debug,
    StaticConfig,
    ExecutionConfig,
    GraphQlFunctionType,
    FunctionHandlerCode,
    FunctionHandlerType,
    IFunctionHandler,
    TriggerDefinition,
    TriggerStageType,
    WebhookDefinition,
    TriggerType } from "../../common";
import { InvalidConfiguration, InvalidArgument } from "../../errors";
import { GraphqlController } from "../../engine";



export class ProjectController {

    /**
     * public functions
     */

    static async initialize(config: ExecutionConfig): Promise<ProjectDefinition> {

        const name = path.basename(StaticConfig.rootExecutionDir);
        debug("start initialize project \"" + name + "\"");

        let project = ProjectController.initCleanProject(name);

        debug("load main yml file");
        const data = ProjectController.loadConfigFile();

        debug("load functions");
        project.functions = FunctionUtils.load(data);

        debug("load functions count = " + project.functions.length);

        debug("load schema");
        project.gqlSchema = GraphqlController.loadSchema(project);

        debug("resolve function graphql types");
        const functionGqlTypes = GraphqlController.defineGqlFunctionsType(project);

        FunctionUtils.resolveGqlFunctionTypes(project, functionGqlTypes);

        debug("load triggers");
        project.triggers = TriggerUtils.mergeStages(TriggerUtils.load(data));

        project.webhooks = WebhookUtils.load(data);

        debug("initialize project comlete");
        return project;
    }

    static getFunctionSourceCode(project: ProjectDefinition): string[] {
        const nativeFunctions = project.functions.filter(f => f.handler.type() === FunctionHandlerType.Code);
        return _.transform<FunctionDefinition, string>(nativeFunctions, (result, f) => {
            result.push(path.join(StaticConfig.rootExecutionDir, f.handler.value()));
        }, []);
    }

    static saveSchema(project: ProjectDefinition, outDir: string) {
        const graphqlFilePath = path.join(outDir, 'schema.graphql');
        fs.writeFileSync(graphqlFilePath, project.gqlSchema);
    }

    static saveMetaDataFile(project: ProjectDefinition, outDir: string) {
        const functions = _.transform(project.functions, (res, func) => {
            res.push({
                name: func.name,
                type: func.type.toString(),
                gqlType: func.gqlType,
                handler: func.name + ".handler"
            });
        }, []);

        const summaryFile = path.join(outDir, '__summary__functions.json');
        fs.writeFileSync(summaryFile, JSON.stringify(
            {
                functions,
                triggers: project.triggers,
                webhooks: project.webhooks
            },
            null,
            2
        ));
    }

    static getSchemaPaths(project: ProjectDefinition): string[] {
        return _.transform(project.functions, (res, f) => {
            if (!_.isString(f.gqlschemaPath)) {
                return;
            }
            const p = path.join(project.rootPath, f.gqlschemaPath);
            if (!fs.existsSync(p)) {
                throw new Error("schema path \"" + p + "\" not present");
            }
            res.push(p);
        }, []);
    }

    static getFunctions(project: ProjectDefinition): FunctionDefinition[] {
        return project.functions;
    }

    /**
     * private functions
     */

    private static loadConfigFile(): any {
        const pathToYmlConfig = StaticConfig.serviceConfigFileName;

        debug("check exist yaml file = " + pathToYmlConfig);

        if (!fs.existsSync(pathToYmlConfig)) {
            throw new Error("Main configuration file \"" + StaticConfig.serviceConfigFileName + "\" is absent.");
        }

        debug("load yaml file");

        try {
            return yaml.safeLoad(fs.readFileSync(pathToYmlConfig, 'utf8'));
        }
        catch(ex) {
            throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, ex.message);
        }
    }

    private static initCleanProject(name: string): ProjectDefinition {
        return {
            functions: [],
            name,
            rootPath: StaticConfig.rootExecutionDir,
            gqlSchema: "",
            triggers: [],
            webhooks: []
        };
    }
}


namespace FunctionUtils {

    export function load(config: any): FunctionDefinition[] {

        return _.transform<any, FunctionDefinition>(config.functions, (result, func, funcname: string) => {

            FunctionUtils.validateFunctionDefinition(func, funcname);

            result.push({
                name: funcname,
                type: FunctionUtils.resolveFunctionType(func.type, funcname),
                handler: resolveHandler(funcname, func.handler),
                gqlschemaPath: func.schema
             });
        }, []);
    }

    export function resolveHandler(name: string, handler: any): IFunctionHandler {
        if (handler.code) {
            return new FunctionHandlerCode(handler.code);
        }
        throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "handler is invalid for function \"" + name + "\"");
    }

    /**
     * @argument types project, { funcname: type }
     * Function resolve graphql type for each function.
     * we have to know function type (mutation, query) for compile schema on the server side
     */
    export function resolveGqlFunctionTypes(project: ProjectDefinition, types: {[functionName: string]: GraphQlFunctionType} ) {
      project.functions.forEach(func => {
          if (func.type === FunctionType.trigger || func.type === FunctionType.webhook) {
              return func.gqlType = GraphQlFunctionType.NotGraphQl;
          }
          const type = types[func.name];
          if (_.isNil(type)) {
              throw new Error("Cannot define graphql type for function \"" + func.name + "\"");
          }
          func.gqlType = type;
      });
    }

    export function validateFunctionDefinition(func: any, name: string) {
        if (_.isNil(func.handler)) {
            throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "handler is absent for function \"" + name + "\"");
        }

        if (func.handler.code && !fs.existsSync(path.join(StaticConfig.rootExecutionDir, func.handler.code))) {
            throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "unnable to determine function \"" + name + "\" source code");
        }

        if (!StaticConfig.supportedCompileExtension.has(path.extname(func.handler.code))) {
            throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "function \"" + name + "\" have unsupported file extension");
        }
    }

    /**
     *
     * @param type "resolve", "trigger.before", "trigger.after", "subscription", "webhook"
     * @return FunctionType
     */
    export function resolveFunctionType(type: string, functionName: string): FunctionType {
        const funcType = type.split(".")[0];
        const resolvedType = (<any> FunctionType)[funcType];
        if (_.isNil(resolvedType)) {
            throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "Invalid function type " + type + " in function " + functionName);
        }

        return <FunctionType> resolvedType;
    }
}

namespace TriggerUtils {

    export function load(config: any): TriggerDefinition[] {
        return _.transform<any, TriggerDefinition>(config.functions, (result, trigger, name: string) => {
            if (FunctionUtils.resolveFunctionType(trigger.type, trigger.name) !== FunctionType.trigger) {
                return;
            }

            if (_.isNil(trigger.operation)) {
                throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "operation field not present in trigger " + name);
            }

            const operation = trigger.operation.split("."); // TableName.TriggerType

            result.push({
                name: TriggerUtils.resolveTriggerType(operation[1], name),
                table: operation[0],
                stages: [ { stageName: TriggerUtils.resolveTriggerStage(trigger.type, name) , functionName: name }]
            });
        }, []);
    }

    export function mergeStages(triggers: TriggerDefinition[]): TriggerDefinition[] {
        return _.transform<TriggerDefinition, TriggerDefinition>(triggers, (res, trigger) => {
            const triggerPresent = _.find(res, r => r.table === trigger.table && r.name === trigger.name);
            if (triggerPresent) {
                return triggerPresent.stages = _.union(triggerPresent.stages, trigger.stages);
            }
            res.push(trigger);
        }, []);
    }

    export function resolveTriggerType(type: string, funcName: string): TriggerType {
        const resolvedType = (<any> TriggerType)[type];
        if (_.isNil(resolvedType)) {
            throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "Invalid trigger type " + type + " in function " + funcName);
        }

        return <TriggerType> resolvedType;
    }

    /**
     *
     * @param type "resolve", "trigger.before", "trigger.after", "subscription"
     * @return TriggerStageType
     */
    export function resolveTriggerStage(type: string, functionName: string): TriggerStageType {
        if (FunctionUtils.resolveFunctionType(type, functionName) === FunctionType.resolver) {
            throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "Cann't resolve trigger type in function = " + functionName);
        }

        const triggerType = type.split(".")[1];
        const resolvedType = (<any> TriggerStageType)[triggerType];
        if (_.isNil(resolvedType)) {
            throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "Invalid trigger type " + type + " in function " + functionName);
        }

        return <TriggerStageType> resolvedType;
    }

}

namespace WebhookUtils {
    export function load(config: any): WebhookDefinition[] {
        return _.transform<any, WebhookDefinition>(config.functions, (result, webhook, name: string) => {
            if (FunctionUtils.resolveFunctionType(webhook.type, webhook.name) !== FunctionType.webhook) {
                return;
            }

            if (!webhook.method) {
                throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "Http method in webhook " + name + " is absent.");
            }

            result.push({
                name,
                functionName: name,
                httpMethod: webhook.method,
                path: webhook.path ? webhook.path : name,
                appId: StaticConfig.applicationId
            });
        }, []);
    }
}