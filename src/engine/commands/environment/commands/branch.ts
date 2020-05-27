import * as yargs from "yargs";
import { Context } from "../../../../common/context";
import { translations } from "../../../../common/translations";
import { GraphqlAsyncActions } from "../../../../consts/GraphqlActions";
import { ProjectConfigurationState } from "../../../../common/configuraion";
import { Interactive } from "../../../../common/interactive";
import { EnvironmentCloneModeType } from "../../../../consts/Environment";
import { executeAsync } from "../../../../common/execute";

export default {
  command: "branch",
  handler: async (params: any, context: Context) => {
    ProjectConfigurationState.expectConfigured(context);
    let { name } = params;
    const { environment } = context.workspaceConfig;
    await executeAsync(context, GraphqlAsyncActions.environmentBranch, { environmentId: environment.id, environmentName: name })
  },

  describe: translations.i18n.t("environment_branch_describe"),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("environment_branch_usage"))
      .option("name", {
        alias: "n",
        describe: translations.i18n.t("environment_branch_name_describe"),
        type: "string",
        demandOption: translations.i18n.t("environment_branch_name_option_error"),
      });
  }
};
