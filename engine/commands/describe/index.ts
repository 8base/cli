import { BaseCommand } from "../base";
import {
    ExecutionConfig,
    trace
} from "../../../common";
import * as fs from "fs";
import { ServerConnector } from "../../connectors";
import { WebhookController } from "../../controllers";

export default class Describe extends BaseCommand {

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

        if (this.functions || this.allPrint) {
            trace("Functions: ");
            trace(JSON.stringify(result.functions, null, 2));
            trace("");
        }

        if (this.webhooks || this.allPrint) {
            trace("Webhooks: ");
            trace(JSON.stringify(WebhookController.resolve(result.webhooks), null, 2));
            trace("");
        }

        if (this.triggers || this.allPrint) {
            trace("Triggers: ");
            trace(JSON.stringify(result.triggers, null, 2));
        }
    }

    onSuccess(): string {
        return "";
    }

    usage(): string {
        return "";
    }

    name(): string {
        return "describe";
    }

}
