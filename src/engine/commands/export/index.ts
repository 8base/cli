import * as fs from "fs";
import * as yargs from "yargs";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { GraphqlActions } from "../../../consts/GraphqlActions";

const { exportTables } = require("@8base/api-client");

export default {
  command: "export",
  handler: async (params: any, context: Context) => {
    context.spinner.start(context.i18n.t("export_in_progress"));

    const tables = await exportTables(context.request.bind(context));

    const exportResult = {
      tables,
      version: context.version,
    };

    fs.writeFileSync(params.file, JSON.stringify(exportResult, null, 2));

    context.spinner.stop();
  },

  describe: translations.i18n.t("export_describe"),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("export_usage"))
      .option("f", {
        alias: "file",
        describe: translations.i18n.t("export_file_describe"),
        type: "string"
      });
  }
};
