import * as yargs from "yargs";

import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { MigrationController } from "../../controllers/migrationController";

export default {
  command: "migration:create",

  handler: async (params: any, context: Context) => {
    await MigrationController.migrationCreate(context, params.name);

    context.logger.info(context.i18n.t("migration_create_success"));
  },

  describe: translations.i18n.t("migration_create_describe"),

  builder: (args: yargs.Argv): yargs.Argv => args
    .usage(translations.i18n.t("migration_create_usage"))
    .option("name", {
      alias: "n",
      describe: "migration name",
      type: "string",
      demand: true
    })
};
