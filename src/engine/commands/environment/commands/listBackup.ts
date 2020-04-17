import * as yargs from "yargs";
import { Context } from "../../../../common/context";
import { translations } from "../../../../common/translations";
import { GraphqlActions, GraphqlAsyncActions } from "../../../../consts/GraphqlActions";
import { ConfigurationState } from "../../../../common/configuraion";
import { Interactive } from "../../../../common/interactive";
import { executeAsync } from "../../../../common/execute";
import { table } from "table";

const ENVIRONMENT_TABLE_HEADER = ['Name', 'Size'];

export default {
  command: "list-backup",
  handler: async (params: any, context: Context) => {
    ConfigurationState.expectConfigured(context);

    let { environmentId } = params;
    if (!environmentId) {
      const environments = await context.getEnvironments(context.workspaceConfig.workspaceId);
      ({ environmentId } = await Interactive.ask({
        name: "environmentId",
        type: "select",
        message: translations.i18n.t("environment_backup_list_select_environment"),
        choices: environments.map(e => ({ title: e.name, value: e.id })),
      }));

      if (!environmentId) {
        throw new Error(translations.i18n.t("configure_prevent_select_workspace"));
      }
    }

    const { system } = await context.request(GraphqlActions.environmentBackupsList, { environmentId });
    const backups = system.backups.items;
    context.logger.info(table([ENVIRONMENT_TABLE_HEADER, ...backups.map((b: any) => [b.name, b.size])]));
  },

  describe: translations.i18n.t("environment_backup_list_describe"),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("environment_backup_list_usage"))
      .option("environmentId", {
        alias: "e",
        describe: translations.i18n.t("environment_backup_list_id_describe"),
        type: "string",
      });
  }
};
