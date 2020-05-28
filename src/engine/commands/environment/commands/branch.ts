import * as yargs from "yargs";
import { Context } from "../../../../common/context";
import { translations } from "../../../../common/translations";
import { GraphqlAsyncActions } from "../../../../consts/GraphqlActions";
import { ProjectConfigurationState } from "../../../../common/configuraion";
import { executeAsync } from "../../../../common/execute";

export default {
  command: "branch",
  handler: async (params: any, context: Context) => {
    ProjectConfigurationState.expectConfigured(context);
    let { name } = params;
    const { environment } = context.workspaceConfig;
    context.spinner.start(context.i18n.t('environment_branch_in_progress'));
    await executeAsync(context, GraphqlAsyncActions.environmentBranch, { environmentId: environment.id, environmentName: name })
    context.spinner.stop();
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
