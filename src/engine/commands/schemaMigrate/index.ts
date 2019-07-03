import * as yargs from "yargs";

import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { MigrationController } from "../../controllers/migrationController";

export default {
  command: "schema:migrate",
  handler: async (params: any, context: Context) => {
    await MigrationController.createMigrationMetaTableIfNeeded(context);

    const pendingMigrations = await MigrationController.getPendingMigrations(context);

    if (pendingMigrations.length === 0) {
      context.logger.info(context.i18n.t("schema_migrate_all_migrations_are_already_applied"));
      return;
    }

    await MigrationController.runMigrations(context, pendingMigrations);
  },

  describe: translations.i18n.t("schema_migrate_describe"),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t("schema_migrate_usage"))
};
