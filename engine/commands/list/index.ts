import { trace, debug, StaticConfig } from "../../../common";
import { BaseCommand } from "../base";
import { ExecutionConfig } from "../../../common";
import * as _ from "lodash";
import { InvalidArgument } from '../../../errors';
import * as fs from "fs";


export default class Invoke extends BaseCommand {

    private functions: boolean;

    async commandInit(config: ExecutionConfig): Promise<any> {
        this.functions = config.getParameter("f");
    }

    async run(): Promise<any> {
        throw new Error("command not implemented");
    }

    onSuccess(): string {
        return "invoke function result = " ;
    }

    usage(): string {
        return "-f <function_name>";
    }

    name(): string {
        return "invoke";
    }

}
