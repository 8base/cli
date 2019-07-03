import * as yargs from "yargs";

import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { MigrationController } from "../../controllers/migrationController";

export default {
  command: "schema:migrate:status",

  handler: async (params: any, context: Context) => {
    let appliedMigrations = null;

    try {
      appliedMigrations = await MigrationController.getAppliedMigrations(context);
    } catch {
      context.logger.error(context.i18n.t("schema_migrate_status_cant_fetch_migration_meta_table"));
      return;
    }

    if (appliedMigrations.length > 0) {
      context.logger.info(context.i18n.t("schema_migrate_status_applied_migrations"));
      context.logger.info("");

      appliedMigrations.forEach(({ name, filename }) => {
        context.logger.info(`${name} (${filename})`);
      });

      context.logger.info("");
    }

    let pendingMigrations = null;

    try {
      pendingMigrations = await MigrationController.getPendingMigrations(context);
    } catch {
      context.logger.error(context.i18n.t("schema_migrate_status_cant_fetch_migration_meta_table"));
      return;
    }

    if (pendingMigrations.length > 0) {
      context.logger.info(context.i18n.t("schema_migrate_status_pending_migrations"));
      context.logger.info("");

      pendingMigrations.forEach(({ name, filename }) => {
        context.logger.info(`${name} (${filename})`);
      });

      context.logger.info("");
    } else {
      context.logger.info(context.i18n.t("schema_migrate_status_all_migrations_are_already_applied"));
    }
  },

  describe: translations.i18n.t("schema_migrate_status_describe"),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t("schema_migrate_status_usage"))
};
