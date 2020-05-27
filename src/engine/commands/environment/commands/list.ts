import * as fs from "fs";
import * as yargs from "yargs";
import { Context } from "../../../../common/context";
import { translations } from "../../../../common/translations";
import { GraphqlActions, GraphqlAsyncActions } from "../../../../consts/GraphqlActions";
import { exportTables } from "@8base/api-client";
import { ProjectConfigurationState } from "../../../../common/configuraion";
import { Interactive } from "../../../../common/interactive";
import { DeployModeType } from "../../../../interfaces/Extensions";
import { EnvironmentCloneModeType } from "../../../../consts/Environment";
import { executeAsync } from "../../../../common/execute";
import chalk from "chalk";
import { table } from "table";

const ENVIRONMENT_TABLE_HEADER = ['Id', 'Name'];

export default {
  command: "list",
  handler: async (params: any, context: Context) => {
    ProjectConfigurationState.expectConfigured(context);
    const environments = await context.getEnvironments(context.workspaceConfig.workspaceId);
    context.logger.info(table([ENVIRONMENT_TABLE_HEADER, ...environments.map(e => [e.id, e.name])]));
  },

  describe: translations.i18n.t("environment_list_describe"),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('environment_list_usage'))
      .option('query', {
        alias: 'q',
        type: 'string',
      }),
};
