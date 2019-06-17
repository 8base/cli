import * as fs from "fs-extra";
import * as yargs from "yargs";
import * as path from "path";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { exportTables, exportData } from "@8base/api-client";
import { TableSchema } from "@8base/utils";

type ExportResult = {
  tables: TableSchema[];
  version: string;
  data?: { [key: string]: any[] };
};

export default {
  command: "export",
  handler: async (params: any, context: Context) => {
    context.spinner.start(context.i18n.t("export_schema_in_progress"));

    const tables = await exportTables(context.request.bind(context), { withSystemTables: params.systemTables });

    context.spinner.stop();

    let exportResult: ExportResult  = {
      version: context.version,
      tables,
    };

    fs.mkdirpSync(params.destination);

    if (params.data) {
      context.spinner.start(context.i18n.t("export_data_in_progress"));

      exportResult.data = await exportData(context.request.bind(context), tables, { pathToSaveFiles: path.join(params.destination, "files") });

      context.spinner.stop();
    }

    fs.writeFileSync(path.join(params.destination, "WORKSPACE.json"), JSON.stringify(exportResult, null, 2));
  },

  describe: translations.i18n.t("export_describe"),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("export_usage"))
      .option("destination", {
        alias: "dest",
        demandOption: true,
        describe: translations.i18n.t("export_destination_describe"),
        type: "string"
      })
      .option("data", {
        describe: translations.i18n.t("export_data_describe"),
        default: true,
        type: "boolean"
      })
      .option("system-tables", {
        describe: translations.i18n.t("export_system-tables_describe"),
        default: false,
        type: "boolean"
      });
  }
};
