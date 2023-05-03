import yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { GraphqlAsyncActions } from '../../../../consts/GraphqlActions';
import { ProjectConfigurationState } from '../../../../common/configuraion';
import { executeAsync } from '../../../../common/execute';

export default {
  command: 'create',
  handler: async (params: any, context: Context) => {
    await ProjectConfigurationState.expectConfigured(context);
    context.spinner.start(context.i18n.t('backup_create_in_progress'));
    await executeAsync(context, GraphqlAsyncActions.backupCreate, { name: context.workspaceConfig.environmentName });
    context.spinner.stop();
  },

  describe: translations.i18n.t('backup_create_describe'),

  builder: (args: yargs.Argv): yargs.Argv => args.usage(translations.i18n.t('backup_create_usage')),
};
