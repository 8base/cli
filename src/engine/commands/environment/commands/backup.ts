import * as yargs from "yargs";
import { Context } from "../../../../common/context";
import { translations } from "../../../../common/translations";
import { GraphqlActions, GraphqlAsyncActions } from "../../../../consts/GraphqlActions";
import { Configuration } from "../../../../common/configuraion";
import { Interactive } from "../../../../common/interactive";
import { executeAsync } from "../../../../common/execute";

export default {
  command: "backup",
  handler: async (params: any, context: Context) => {

    Configuration.expectConfigured(context);
    let { environmentId } = params;
    const { workspaceId } = context.workspaceConfig;

    if (!environmentId) {
      const environments = await context.getEnvironments(workspaceId);
      ({ environmentId } = await Interactive.ask({
        name: "environmentId",
        type: "select",
        message: translations.i18n.t("environment_backup_select_environment"),
        choices: environments.map(e => ({ title: e.name, value: e.id })),
      }));

      if (!environmentId) {
        throw new Error(translations.i18n.t("configure_prevent_select_workspace"));
      }
    }

    await executeAsync(context, GraphqlAsyncActions.environmentBackup, { environmentId })
  },

  describe: translations.i18n.t("environment_backup_describe"),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("environment_backup_in_usage"))
      .option("environmentId", {
        alias: "e",
        describe: translations.i18n.t("environment_backup_id_describe"),
        type: "string",
      });
  }
};
