import * as yargs from "yargs";

import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { MigrationController } from "../../controllers/migrationController";

export default {
  command: "schema:migrate:undo",

  handler: async (params: any, context: Context) => {
    await MigrationController.undoMigrations(context, 1);
  },

  describe: translations.i18n.t("schema_migrate_undo_describe"),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t("schema_migrate_undo_usage"))
};
