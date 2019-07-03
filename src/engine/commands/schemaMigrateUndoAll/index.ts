import * as yargs from "yargs";

import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { MigrationController } from "../../controllers/migrationController";

export default {
  command: "schema:migrate:undo:all",

  handler: async (params: any, context: Context) => {
    await MigrationController.undoMigrations(context);
  },

  describe: translations.i18n.t("schema_migrate_undo_all_describe"),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t("schema_migrate_undo_all_usage"))
};
