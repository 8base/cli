import yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { GraphqlActions } from '../../../../consts/GraphqlActions';
import download from 'download';
import * as path from 'path';
import { StaticConfig } from '../../../../config';
import { ProjectConfigurationState } from '../../../../common/configuraion';

const DEFAULT_MIGRATIONS_PATH = './migrations';

export default {
  command: 'generate',

  handler: async (params: { dist: string; tables?: string[]; environment?: string }, context: Context) => {
    await ProjectConfigurationState.expectHasProject(context);
    context.spinner.start(context.i18n.t('migration_generate_in_progress'));
    const dist = params.dist;
    const { system } = await context.request(
      GraphqlActions.migrationGenerate,
      { tables: params.tables },
      { customEnvironment: params.environment },
    );
    await download(system.ciGenerate.url, path.join(StaticConfig.rootExecutionDir, dist), { extract: true });
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
