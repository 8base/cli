import * as yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { GraphqlAsyncActions } from '../../../../consts/GraphqlActions';
import { ProjectConfigurationState } from '../../../../common/configuraion';
import { executeAsync } from '../../../../common/execute';

export default {
  command: 'import',
  handler: async (params: any, context: Context) => {
    ProjectConfigurationState.expectConfigured(context);
    let { environment, template } = params;
    context.spinner.start(context.i18n.t('backup_import_in_progress'));
    await executeAsync(context, GraphqlAsyncActions.backupImport, { name: environment, template });
    context.spinner.stop();
  },

  describe: translations.i18n.t('backup_import_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('backup_import_usage'))
      .option('environment', {
        alias: 'e',
        describe: translations.i18n.t('backup_import_env_name_describe'),
        type: 'string',
        demandOption: true,
      })
      .option('url', {
        alias: 'u',
        describe: translations.i18n.t('backup_import_url_describe'),
        type: 'string',
        demandOption: true,
      }),
};
