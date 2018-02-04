import * as fs from "fs";
import * as path from 'path';
import * as yaml from "js-yaml";
import * as _ from "lodash";

import { FunctionDefinition, ProjectDefinition, FunctionType, trace, debug, StaticConfig, ExecutionConfig, GraphQlFunctionType } from "../../common";
import { InvalidConfiguration } from "../../errors";
import { GraphqlController } from "../../engine";


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

    static getFunctionHandlers(project: ProjectDefinition): string[] {
        return _.transform<FunctionDefinition, string>(project.functions, (result, f) => {
            result.push(path.join(StaticConfig.rootExecutionDir, f.handler.code));
        }, []);
    }

    static getFunctions(project: ProjectDefinition): FunctionDefinition[] {
        return project.functions;
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

    /**
     * private functions
     */

    private static setGqlFunctionTypes(project: ProjectDefinition, types: any) {
        ProjectController.getFunctions(project).forEach(func => {
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
                handler: { code: func.handler.code },
                gqlschemaPath: func.schema
             });
        }, []);
    }

    private static validateFunction(func: any, name: string) {
        if (_.isNil(func.handler.code) || !fs.existsSync(path.join(StaticConfig.rootExecutionDir, func.handler.code))) {
            throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "unnable to determine function \"" + name + "\" source code");
        }

        if (!StaticConfig.supportedCompileExtension.has(path.extname(func.handler.code))) {
            throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "function \"" + name + "\" have unsupported file extension");
        }
    }
}


