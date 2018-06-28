import {
  ExecutionConfig,
  trace,
  debug
} from "../../../common";
import { BaseCommand } from "../base";
import { RemoteActionController } from "../../controllers";
import * as _ from "lodash";
import { InvalidArgument } from '../../../errors';
import * as fs from "fs";
import 'isomorphic-fetch';
import { WebhookController } from "../../controllers";
import { ServerConnector } from "../../connectors";
import * as request from "request";

export default class Webhook extends BaseCommand {

    private invokeWebhookName: string;

    private result: string;

    async commandInit(config: ExecutionConfig): Promise<any> {
      if (config.isParameterPresent("i")) {
        this.invokeWebhookName = config.getParameter("name");

        if (!this.invokeWebhookName) {
          throw new InvalidArgument("name");
        }
      }
    }

    async run(): Promise<any> {
      const webhook = (await ServerConnector().describeBuild()).webhooks.find(w => w.name === this.invokeWebhookName);
      if (!webhook) {
        throw new InvalidArgument(`webhook ${this.invokeWebhookName} is absent.`);
      }

      const resolved = WebhookController.resolveSingle(webhook);
      debug("find webhook = " + resolved.name + " path = " + resolved.resolvedAccountRelativePath);

      return new Promise<any>((resolve, reject) => {
        request({
            method: resolved.httpMethod,
            url: resolved.resolvedAccountRelativePath
        },
        (err: any, res: any, body: any) => {
            if (err) {
              return reject(err);
            }
            if (res && res.statusCode !== 200 ) {
              return reject(new Error(res.body));
            }
            this.result = JSON.stringify(res, null, 2);
            resolve();
        });
});
    }

    onSuccess(): string {
        return this.result;
    }

    usage(): string {
        return ``;
    }

    name(): string {
        return "webhook";
    }

}
