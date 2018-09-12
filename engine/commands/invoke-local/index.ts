import * as yargs from "yargs";
import { Context, Translations } from "../../../common/Context";
import _ = require("lodash");


export default {
  name: "invoke-local",
  handler: async (params: any, context: Context) => {
    throw new Error("not implemented");
  },
  describe: 'Invoke function locally',
  builder: (args: yargs.Argv, translations: Translations): yargs.Argv => {
    return args
      .usage(translations.i18n.t("invokelocal_usage"))
      .option("f", {
        alias: 'function',
        require: true,
        type: "string",
        describe: "function to invoke"
      })
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
