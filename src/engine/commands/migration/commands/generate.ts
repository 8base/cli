import * as path from 'node:path';
import yargs from 'yargs';

import { StaticConfig } from '../../../../config';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { GraphqlActions } from '../../../../consts/GraphqlActions';
import { ProjectConfigurationState } from '../../../../common/configuraion';
import { Utils } from '../../../../common/utils';

type MigrationGenerateParams = { dist: string; tables?: string[]; environment?: string };

const DEFAULT_MIGRATIONS_PATH = './migrations';

export default {
  command: 'generate',

  handler: async (params: MigrationGenerateParams, context: Context) => {
    await ProjectConfigurationState.expectHasProject(context);

    context.spinner.start(context.i18n.t('migration_generate_in_progress'));

    const dist = params.dist;
    const { system } = await context.request(
      GraphqlActions.migrationGenerate,
      { tables: params.tables },
      { customEnvironment: params.environment },
    );

    const archive = await Utils.downloadArchive(system.ciGenerate.url);
    archive.extractAllTo(path.join(StaticConfig.rootExecutionDir, dist), true);

    context.spinner.stop();
  },

  describe: translations.i18n.t('migration_generate_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('migration_generate_usage'))
      .option('dist', {
        describe: translations.i18n.t('migration_generate_dist_describe'),
        type: 'string',
        default: DEFAULT_MIGRATIONS_PATH,
        requiresArg: true,
      })
      .option('tables', {
        alias: 't',
        describe: translations.i18n.t('migration_generate_tables_describe'),
        type: 'array',
      })
      .option('environment', {
        alias: 'e',
        describe: translations.i18n.t('migration_generate_environment_describe'),
        type: 'string',
        requiresArg: true,
      }),
};
