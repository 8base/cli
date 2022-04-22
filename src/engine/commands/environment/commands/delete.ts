import * as yargs from 'yargs';
import { ProjectConfigurationState } from '../../../../common/configuraion';
import { Context } from '../../../../common/context';
import { executeAsync } from '../../../../common/execute';
import { translations } from '../../../../common/translations';
import { DEFAULT_ENVIRONMENT_NAME } from '../../../../consts/Environment';
import { GraphqlAsyncActions } from '../../../../consts/GraphqlActions';

export default {
  command: 'delete',
  handler: async (params: { name: string }, context: Context) => {
    ProjectConfigurationState.expectConfigured(context);

    const { name } = params;

    context.spinner.start(context.i18n.t('environment_delete_in_progress'));
    await executeAsync(context, GraphqlAsyncActions.environmentDelete, { environmentName: name });
    context.spinner.stop();

    if (name === context.workspaceConfig.environmentName) {
      context.updateEnvironmentName(DEFAULT_ENVIRONMENT_NAME);
    }
  },

  describe: translations.i18n.t('environment_delete_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args.usage(translations.i18n.t('environment_delete_usage')).option('name', {
      alias: 'n',
      describe: translations.i18n.t('environment_delete_name_describe'),
      type: 'string',
      demandOption: true,
    }),
};
