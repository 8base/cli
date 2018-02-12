import * as fs from "fs";
import * as path from 'path';
import * as yaml from "js-yaml";
import * as _ from "lodash";

import { FunctionDefinition, ProjectDefinition, FunctionType, trace, debug, StaticConfig, ExecutionConfig, GraphQlFunctionType, FunctionHandlerCode, FunctionHandlerWebhook } from "../../common";
import { InvalidConfiguration } from "../../errors";
import { GraphqlController } from "../../engine";
import { FunctionHandlerType, IFunctionHandler } from '../../common/definitions/project';


export class ProjectController {

    /**
     * public functions
     */

    static async initialize(config: ExecutionConfig): Promise<ProjectDefinition> {

        const name = path.basename(StaticConfig.rootExecutionDir);
        debug("start initialize project \"" + name + "\"");

        let project: ProjectDefinition = {
            functions: [],
            name,
            rootPath: StaticConfig.rootExecutionDir,
            gqlSchema: ""
        };

        const data = ProjectController.loadConfigFile();

        debug("load functions");
        project.functions = ProjectController.loadFunctions(data);

        debug("load functions count = " + project.functions.length);

        project.gqlSchema = GraphqlController.loadSchema(project);

        const functionGqlTypes = GraphqlController.defineGqlFunctionsType(project);

        ProjectController.setGqlFunctionTypes(project, functionGqlTypes);

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

    static saveFunctionMetaData(project: ProjectDefinition, outDir: string) {
        const data = _.transform(project.functions, (res, func) => {
            res.push({
                name: func.name,
                type: func.type.toString(),
                gqlType: func.gqlType,
                handler: func.name + ".handler"
            });
        }, []);

        const summaryFile = path.join(outDir, '__summary__functions.json');
        fs.writeFileSync(summaryFile, JSON.stringify(data, null, 2));
    }

    static getSchemaPaths(project: ProjectDefinition): string[] {
        return _.transform(project.functions, (res, f) => {
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

    private static setGqlFunctionTypes(project: ProjectDefinition, types: any) {
        project.functions.forEach(func => {
            const type = types[func.name];
            if (_.isNil(type)) {
                throw new Error("Cannot define graphql type for function \"" + func.name + "\"");
            }
            func.gqlType = type;
        });
    }

    private static loadConfigFile(): any {
        const pathToYmlConfig = StaticConfig.serviceConfigFileName;

        debug("check exist yaml file = " + pathToYmlConfig);

        if (!fs.existsSync(pathToYmlConfig)) {
            throw new Error("Main configuration file \"" + StaticConfig.serviceConfigFileName + "\" is absent.");
        }

        debug("load yaml file");

        return yaml.safeLoad(fs.readFileSync(pathToYmlConfig, 'utf8'));
    }

    private static loadFunctions(config: any): FunctionDefinition[] {

        return _.transform<any, FunctionDefinition>(config.functions, (result, func, funcname: string) => {

            this.validateFunction(func, funcname);

            result.push({
                name: funcname,
                type: func.type as FunctionType,
                handler: ProjectController.resolveHandler(funcname, func.handler),
                gqlschemaPath: func.schema
             });
        }, []);
    }

    private static resolveHandler(name: string, handler: any): IFunctionHandler {
        if (handler.code) {
            return new FunctionHandlerCode(handler.code);
        } else if (handler.webhook) {
            return new FunctionHandlerWebhook(handler.webhook);
        }
        throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "handler is invalid for function \"" + name + "\"");
    }

    private static validateFunction(func: any, name: string) {
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
}


