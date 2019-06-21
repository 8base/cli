import * as _ from "lodash";
import * as fs from "fs";
import * as yargs from "yargs";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { importTables, importData } from "@8base/api-client";

const NOT_SUPPORTED_TABLES = ["Settings", "AuthenticationSettings", "Roles"];

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

    if (params.schema) {
      context.spinner.start(context.i18n.t("import_schema_in_progress"));

      await importTables(context.request.bind(context), _.get(schema, "tables", []), { debug: params.d });

      context.spinner.stop();
    }

    if (params.data) {
      context.spinner.start(context.i18n.t("import_data_in_progress"));

      let data = _.get(schema, "data", {});

      if (Object.keys(data).some(tableName => NOT_SUPPORTED_TABLES.includes(tableName))) {
        console.warn(`\nTables ${NOT_SUPPORTED_TABLES.join(", ")} aren't supported yet and will be ignored.`);
      }

      data = _.omit(data, NOT_SUPPORTED_TABLES);

      await importData(context.request.bind(context), data, { strict: params.strict });

      context.spinner.stop();
    }
  },

  describe: translations.i18n.t("import_describe"),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("import_usage"))
      .option("f", {
        alias: "file",
        demandOption: true,
        describe: translations.i18n.t("import_file_describe"),
        type: "string"
      })
      .option("schema", {
        describe: translations.i18n.t("import_schema_describe"),
        default: true,
        type: "boolean"
      })
      .option("data", {
        describe: translations.i18n.t("import_data_describe"),
        default: true,
        type: "boolean"
      })
      .option("strict", {
        describe: translations.i18n.t("import_strict_describe"),
        default: false,
        type: "boolean"
      });
  }
};
