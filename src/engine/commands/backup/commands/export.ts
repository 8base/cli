import * as yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { ProjectConfigurationState } from '../../../../common/configuraion';
import { GraphqlActions } from '../../../../consts/GraphqlActions';

export default {
  command: 'export',
  handler: async (params: any, context: Context) => {
    ProjectConfigurationState.expectConfigured(context);
    const { environment, backup } = params;
    const {
      system: {
        environmentBackupUrl: { url },
      },
    } = await context.request(GraphqlActions.backupUrl, { name: environment, backup });
    console.log(url);
    context.spinner.stop();
  },

  describe: translations.i18n.t('environment_backup_export_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('environment_backup_export_usage'))
      .option('environment', {
        alias: 'e',
        describe: translations.i18n.t('environment_backup_export_env_name_describe'),
        type: 'string',
        demandOption: true,
      })
      .option('backup', {
        alias: 'b',
        describe: translations.i18n.t('environment_backup_export_name_describe'),
        type: 'string',
        demandOption: true,
      }),
};
