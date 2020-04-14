import * as fs from "fs";
import * as yargs from "yargs";
import { Context } from "../../../../common/context";
import { translations } from "../../../../common/translations";
import { GraphqlActions, GraphqlAsyncActions } from "../../../../consts/GraphqlActions";
import { exportTables } from "@8base/api-client";
import { Configuration } from "../../../../common/configuraion";
import { Interactive } from "../../../../common/interactive";
import { DeployModeType } from "../../../../interfaces/Extensions";
import { EnvironmentCloneModeType } from "../../../../consts/Environment";
import { executeAsync } from "../../../../common/execute";

export default {
  command: "clone",
  handler: async (params: any, context: Context) => {
    Configuration.expectConfigured(context);
    let { sourceEnvironmentId, environmentName, mode } = params;
    const { workspaceId } = context.workspaceConfig;

    if (!sourceEnvironmentId) {
      const environments = await context.getEnvironments(workspaceId);
      ({ sourceEnvironmentId } = await Interactive.ask({
        name: "environment",
        type:"select",
        message: translations.i18n.t(""),
        choices: environments.map(e => ({ title: e.name, value: e.id }))
      }));

      if (!sourceEnvironmentId) {
        throw new Error(translations.i18n.t("configure_prevent_select_workspace"));
      }
    }

    await executeAsync(context, GraphqlAsyncActions.environmentClone, { sourceEnvironmentId, environmentName, mode })
  },

  describe: translations.i18n.t("export_describe"),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("clone_usage"))
      .option("sourceEnvironmentId", {
        alias: "s",
        describe: translations.i18n.t("export_file_describe"),
        type: "string",
        demandOption: translations.i18n.t("export_file_required_option_error"),
      })
      .option("mode", {
        alias: 'm',
        describe: translations.i18n.t('deploy_mode_describe'),
        default: EnvironmentCloneModeType.SYSTEM,
        type: 'string',
        choices: Object.values(EnvironmentCloneModeType),
      })
      .option("environmentName", {
        alias: "e",
        describe: translations.i18n.t("export_file_describe"),
        type: "string",
        demandOption: translations.i18n.t("export_file_required_option_error"),
      });
  }
};
