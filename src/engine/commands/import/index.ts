import * as _ from "lodash";
import * as fs from "fs";
import * as yargs from "yargs";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { importTables, importData } from "@8base/api-client";


export default {
  command: "import",
  handler: async (params: any, context: Context) => {
    let schema;

    if (fs.existsSync(params.file)) {
      try {
        schema = JSON.parse(fs.readFileSync(params.file, "utf8"));
      } catch (e) {
        throw new Error(translations.i18n.t("import_cant_parse_schema"));
      }
    } else {
      throw new Error(translations.i18n.t("import_file_not_exist"));
    }

    if (params.workspace) {
      await context.checkWorkspace(params.workspace);
    }

    if (params.schema) {
      context.spinner.start(context.i18n.t("import_schema_in_progress"));

      const gqlRequest = context.request.bind(context);

      await importTables(
        (query, variables) => gqlRequest(query, variables, true, params.workspace),
        _.get(schema, "tables", {}),
        { debug: params.d }
      );

      context.spinner.stop();
    }

    if (params.data) {
      context.spinner.start(context.i18n.t("import_data_in_progress"));

      await importData(context.request.bind(context), _.get(schema, "data", {}), { maxThreads: 2 });

      context.spinner.stop();
    }
  },

  describe: translations.i18n.t("import_describe"),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("import_usage"))
      .option("file", {
        alias: "f",
        demandOption: true,
        describe: translations.i18n.t("import_file_describe"),
        type: "string"
      }).option("schema", {
        describe: translations.i18n.t("import_schema_describe"),
        default: true,
        type: "boolean"
      }).option("data", {
        describe: translations.i18n.t("import_data_describe"),
        default: true,
        type: "boolean"
      }).option("workspace", {
        alias: "w",
        describe: translations.i18n.t("import_workspace_describe"),
        type: "string"
      });
  }
};
