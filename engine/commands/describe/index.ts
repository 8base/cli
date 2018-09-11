import * as yargs from "yargs";
import { Context } from "../../../common/Context";
import { GraphqlActions } from "../../../consts/GraphqlActions";
import * as url from "url";

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

    context.logger.info(`Resolvers: ${JSON.stringify(result.resolvers, null, 2)}\n`);

    const webhooks = result.webhooks ? result.webhooks.map((w: any) => transformWebhook(w, context)) : [];
    context.logger.info(`Webhooks: ${JSON.stringify(webhooks, null, 2)}`);

    context.logger.info(`Triggers: ${JSON.stringify(result.triggers, null, 2)}`);
  },
  describe: 'Describe project',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args.usage("8base describe [OPTIONS]");
  }
};
