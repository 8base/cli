import * as yargs from "yargs";
import { Context } from "../../../common/context";
import _ = require("lodash");
import { translations } from "../../../common/translations";

export default {
  name: "invoke-local",
  handler: async (params: any, context: Context) => {
    throw new Error("not implemented");
  },
  describe: translations.i18n.t("invokelocal_describe"),
  builder: (args: yargs.Argv): yargs.Argv => {
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
