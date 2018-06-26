import { BaseCommand } from "../base";
import { ExecutionConfig } from "../../../common";
import * as fs from "fs";
import { ServerConnector } from "../../connectors";
import { trace } from '../../../common/tracer';

export default class Invoke extends BaseCommand {

    private functions: boolean;
    private webhooks: boolean;
    private triggers: boolean;

    private allPrint: boolean;

    async commandInit(config: ExecutionConfig): Promise<any> {
        this.functions = config.isParameterPresent("f");
        this.webhooks = config.isParameterPresent("w");
        this.triggers = config.isParameterPresent("t");

        this.allPrint = !this.functions && !this.triggers && !this.webhooks;
    }

    async run(): Promise<any> {
        const result = await ServerConnector().describeBuild();
        if (this.allPrint) {
            trace(result);
        }

        if (this.functions) {
            trace(result.functions);
        }

        if (this.webhooks) {
            trace(result.webhooks);
        }

        if (this.triggers) {
            trace(result.triggers);
        }
    }

    onSuccess(): string {
        return "";
    }

    usage(): string {
        return "-f <function_name>";
    }

    name(): string {
        return "invoke";
    }

}
