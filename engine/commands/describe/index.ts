import * as yargs from "yargs";
import { Context, Translations } from "../../../common/Context";
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
    const webhooks = result.webhooks ? result.webhooks.map((w: any) => transformWebhook(w, context)) : [];

    context.logger.info(
      `Resolvers: ${JSON.stringify(result.resolvers, null, 2)}\n
       Webhooks: ${JSON.stringify(webhooks, null, 2)}
       Triggers: ${JSON.stringify(result.triggers, null, 2)}`
      );
  },
  describe: 'Describe project',
  builder: (args: yargs.Argv, translations: Translations): yargs.Argv => {
    return args.usage(translations.i18n.t("describe_usage"));
  }
};
