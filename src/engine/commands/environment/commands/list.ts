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
import chalk from "chalk";

export default {
  command: "list",
  handler: async (params: any, context: Context) => {
    Configuration.expectConfigured(context);

    const { spinner } = context;
    spinner.start(context.i18n.t("clone_in_progress"));

    const { workspaceId } = context.workspaceConfig;

    const environments = await context.getEnvironments(workspaceId);
    context.logger.info(chalk.green(environments.map(e => e.name).join(", ")));
    spinner.stop();
  },

  describe: translations.i18n.t("export_describe"),

  builder: (args: yargs.Argv): yargs.Argv =>
    args.usage(translations.i18n.t('plugin_list_usage')).option('query', {
      alias: 'q',
      type: 'string',
    }),
};
