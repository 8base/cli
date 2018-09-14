import * as yargs from "yargs";
import { Context } from "../../../common/context";
import _ = require("lodash");
import { GraphqlActions } from "../../../consts/GraphqlActions";
import { translations } from "../../../common/translations";

export default {
  name: "logs",
  handler: async (params: any, context: Context) => {
    context.spinner.start(context.i18n.t("logs_in_progress"));

    const result = await context.request(GraphqlActions.logs, { functionName: params._[1], limit: params.n });
    context.spinner.stop();
    context.logger.info(result.logs);
  },
  describe: translations.i18n.t("logs_describe"),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("logs_usage"))
      .demand(1)
      .option("n", {
        alias: 'num',
        default: 10,
        describe: "number of lines to display (default: 10, max: 100)",
        type: "number",
        coerce: arg => arg > 100 ? 100 : arg
      });
  }
};
