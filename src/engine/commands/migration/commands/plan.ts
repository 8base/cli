import * as yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { GraphqlActions } from "../../../../consts/GraphqlActions";
import { MigrationOutputModeType } from "../../../../consts/Environment";
import { Utils } from "../../../../common/utils";
import * as download from "download";
import { StaticConfig } from "../../../../config";
import { ProjectConfigurationState } from "../../../../common/configuraion";
import en from "../../../../locales/en";
const path = require("path");
const fs = require("fs-extra");

const DEFAULT_MIGRATIONS_PATH = './migrations';

export default {
  command: 'plan',

  handler: async (params: any, context: Context) => {
    ProjectConfigurationState.expectHasProject(context);
    const { output } = params;
    const { environment } = context.workspaceConfig;
    const dist = params.dist || DEFAULT_MIGRATIONS_PATH;

    fs.removeSync(dist)

    const { system } = await context.request(GraphqlActions.migrationPlan, { environmentId: environment.id, output });
    await download(system.plan.url, path.join(StaticConfig.rootExecutionDir, dist), { extract: true });
  },

  describe: translations.i18n.t('migrations_plan_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args.usage(translations.i18n.t('migrations_plan_usage'))
      .option("output", {
        alias: 'o',
        describe: translations.i18n.t('migration_plan_output_describe'),
        default: MigrationOutputModeType.TS,
        type: 'string',
        choices: Object.values(MigrationOutputModeType),
      })
      .option("dist", {
        alias: 'd',
        describe: translations.i18n.t('migration_plan_dist_describe'),
        type: 'string',
        default: String(DEFAULT_MIGRATIONS_PATH),
      })
};
