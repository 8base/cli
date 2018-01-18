import { BaseCommand } from "../base";
import { compile, ExecutionConfig, debug, UserDataStorage, trace, checkCompilingDirectory } from "../../../common";
import { InvalidArgument } from "../../../errors/invalidArgument";
import * as _ from "lodash";

export default class Compile extends BaseCommand {

    private config: ExecutionConfig;

    async run(): Promise<any> {
        

    }

    
    async init(config: ExecutionConfig): Promise<any> {
        debug("init compilind command");
        await checkCompilingDirectory()

        this.config = config;
    }

    usage(): string {
        return "";
    }

    name(): string {
        return "compile";
    }

    onSuccess(): string {
        return "compile complete successfully";
    }

}