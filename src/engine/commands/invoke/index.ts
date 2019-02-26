import * as yargs from "yargs";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import _ = require("lodash");
import { GraphqlActions } from "../../../consts/GraphqlActions";
import * as fs from "fs";

export default {
  name: "invoke",
  handler: async (params: any, context: Context) => {

    context.initializeProject();

    context.spinner.start(context.i18n.t("invoke_in_progress"));

    const args = params.j ? params.j
      : params.p ? fs.readFileSync(params.p) : null;

    const result = await context.request(GraphqlActions.invoke, { data: { functionName: params._[1], inputArgs: args } });
    context.spinner.stop();

    context.logger.info(result.invoke.responseData);
  },
  describe: translations.i18n.t("invoke_describe"),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("invoke_usage"))
      .demand(1)
      .option("j", {
        alias: 'data-json',
        describe: "input JSON",
        type: "string"
      })
      .option("p", {
        alias: 'data-path',
        describe: "path to input JSON",
        type: "string"
      });
  }
};
