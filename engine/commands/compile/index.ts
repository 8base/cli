import { BaseCommand } from "../base";
import { ExecutionConfig, debug, UserDataStorage, trace } from "../../../common";
import { checkCompilingDirectory } from "../../compiling";
import { InvalidArgument } from "../../../errors/invalidArgument";
import * as _ from "lodash";

export default class Compile extends BaseCommand {

    private config: ExecutionConfig;

    async run(): Promise<any> {
    }

    async init(config: ExecutionConfig): Promise<any> {
        debug("init compilind command");
        await checkCompilingDirectory();

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