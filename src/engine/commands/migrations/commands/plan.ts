import * as yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { GraphqlActions } from "../../../../consts/GraphqlActions";
import { MigrationOutputModeType } from "../../../../consts/Environment";
import { Utils } from "../../../../common/utils";
import * as download from "download";
import { StaticConfig } from "../../../../config";
import { ConfigurationState } from "../../../../common/configuraion";
const path = require("path");
const fs = require("fs-extra");

const DEFAULT_MIGRATIONS_PATH = './migrations';

export default {
  command: 'plan',

  handler: async (params: any, context: Context) => {
    ConfigurationState.expectHasProject(context);
    const { sourceId, targetId, output } = params;
    const dist = params.dist || DEFAULT_MIGRATIONS_PATH;

    fs.removeSync(dist)

    const { system } = await context.request(GraphqlActions.migrationPlan, { sourceId, targetId, output} )

    await download(system.plan.url, path.join(StaticConfig.rootExecutionDir, dist), { extract: true });

  },

  describe: translations.i18n.t('migrations_plan_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args.usage(translations.i18n.t('migrations_plan_usage'))
      .option("sourceId", {
        alias: "s",
        describe: translations.i18n.t("migration_plan_source_id_describe"),
        type: "string",
      })
      .option("targetId", {
        alias: "t",
        describe: translations.i18n.t("migration_plan_target_id_describe"),
        type: "string",
      })
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
