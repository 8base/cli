import * as yargs from "yargs";
import { Context, Translations } from "../../../common/Context";
import _ = require("lodash");
import { GraphqlActions } from "../../../consts/GraphqlActions";


export default {
  name: "logs",
  handler: async (params: any, context: Context) => {
    const result = await context.request(GraphqlActions.logs, { functionName: params.f, limit: params.n });
    context.logger.info(result.logs);
  },
  describe: 'Invoke function remotely',
  builder: (args: yargs.Argv, translations: Translations): yargs.Argv => {
    return args
      .usage(translations.i18n.t("logs_usage"))
      .option("f", {
        alias: 'function',
        require: true,
        type: "string",
        describe: "function to invoke"
      })
      .option("n", {
        alias: 'num',
        default: 10,
        describe: "number of lines to display (default: 10, max: 100)",
        type: "number",
        coerce: arg => arg > 100 ? 100 : arg
      });
  }
};
