import * as yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { GraphqlActions } from '../../../../consts/GraphqlActions';
import * as download from 'download';
import { StaticConfig } from '../../../../config';
import { ProjectConfigurationState } from '../../../../common/configuraion';

const path = require('path');

const DEFAULT_MIGRATIONS_PATH = './migrations';

export default {
  command: 'generate',

  handler: async (params: any, context: Context) => {
    ProjectConfigurationState.expectHasProject(context);
    context.spinner.start(context.i18n.t('migration_generate_in_progress'));
    const dist = params.dist || DEFAULT_MIGRATIONS_PATH;
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
        default: String(DEFAULT_MIGRATIONS_PATH),
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
      }),
};
