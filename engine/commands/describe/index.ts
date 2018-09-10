import * as yargs from "yargs";
import { Context } from "../../../common/Context";
import { GraphqlActions } from "../../../consts/GraphqlActions";
import { trace } from "../../../common/tracer";
import * as url from "url";
import { debug } from "util";

const transformWebhook = (webhook: any, context: Context) => {
  return {
    ...webhook,
    httpMethod: webhook.httpMethod.toUpperCase() === "ANY" ? "POST" : webhook.httpMethod,
    fullPath: url.resolve(context.storage.user.getValue("remoteAddress"), this.accountRelativePath)
  };
};

export default {
  name: "describe",
  handler: async (params: any, context: Context) => {

    const result = (await context.request(GraphqlActions.describe)).describeExtensions;

    if (params.f || params.a) {
      trace("Resolvers: ");
      trace(JSON.stringify(result.resolvers, null, 2));
      trace("");
    }

    if (params.w || params.a) {
      const webhooks = result.webhooks ? result.webhooks.map((w: any) => transformWebhook(w, context)) : [];
      trace("Webhooks: ");
      trace(JSON.stringify(webhooks, null, 2));
      trace("");
    }

    if (params.t || params.a) {
      trace("Triggers: ");
      trace(JSON.stringify(result.triggers, null, 2));
    }
  },
  describe: 'Describe project',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage("8base describe [OPTIONS]")
      .option("a", {
        alias: 'all',
        type: "boolean",
        describe: "show all"
      })
      .option("r", {
        alias: 'resolvers',
        type: "boolean",
        describe: "show resolvers"
      })
      .option("t", {
        alias: 'triggers',
        type: "boolean",
        describe: "show triggers"
      })
      .option("w", {
        alias: 'webhook',
        type: "boolean",
        describe: "show webhooks"
      })
      .help()
      .version(false);
  }
};
