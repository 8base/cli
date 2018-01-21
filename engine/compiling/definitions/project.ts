
import { StaticConfig, debug } from "../../../common";
import * as path from "path";
import * as fs from "fs";
import * as yaml from "js-yaml";
import { ProjectDefinition, FunctionDefinition, FunctionHandler, FunctionType } from "./definitions";
import * as _ from "lodash";
import { InvalidConfiguration } from "../../../errors";


export class CompileProject {

    private pathToYmlConfig = path.join(StaticConfig.rootExecutionDir, "./8base.yml");

    private name = path.basename(StaticConfig.rootExecutionDir);

    private config = new ProjectDefinition();

    private loadConfiguration() {
        debug("check exist yaml file = " + this.pathToYmlConfig);
        if (!fs.existsSync(this.pathToYmlConfig)) {
            throw new Error("invalid directory");
        }
        debug("load yaml file");

        const data = yaml.safeLoad(fs.readFileSync(this.pathToYmlConfig, 'utf8'));

        this.config.name = this.name;

        debug("load functions");
        this.config.functions = this.loadFunctions(data);
        debug("load functions count = " + this.config.functions.length);
    }

    private checkConfiguration() {

    }

    async initialize() {
        this.loadConfiguration();

        this.checkConfiguration();

        debug("initialize project \"" + this.name + "\" complete");
    }

    private loadFunctions(config: any):FunctionDefinition[] {
        if (_.isNil(config.functions)) {
            return;
        }

        return _.transform<any, FunctionDefinition>(config.functions, (result, func, funcname: string) => {

            this.validateFunction(func);

            result.push({
                name: funcname,
                type: func.type as FunctionType,
                handler: { path: func.handler.path },
                schema: { path: func.schema }
             });
        }, []);
    }

    get functions(): FunctionDefinition[] {
        return this.config.functions;
    }

//    set functions(funcs: FunctionDefinition[]) {
//        this.config.functions = funcs;
//    }

    private validateFunction(func: FunctionDefinition) {
        if (_.isNil(func.handler.path)) {
            throw new InvalidConfiguration(StaticConfig.serviceConfigFileName, "function \"" + func.name + "\" must contain path property");
        }
    }
}