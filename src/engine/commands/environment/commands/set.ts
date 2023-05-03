import yargs from 'yargs';
import { Context } from '../../../../common/context';
import { Interactive } from '../../../../common/interactive';
import { translations } from '../../../../common/translations';
import { ProjectConfigurationState } from '../../../../common/configuraion';

export default {
  command: 'set',

  handler: async (params: { environmentName?: string }, context: Context) => {
    let { environmentName } = params;
    await ProjectConfigurationState.expectConfigured(context);

    if (!environmentName) {
      const environments = await context.getEnvironments();

      ({ environmentName } = await Interactive.ask({
        name: 'environmentName',
        type: 'select',
        message: translations.i18n.t('environment_set_select_environment'),
        choices: environments.map(e => ({ title: e.name, value: e.name })),
      }));

      if (!environmentName) {
        throw new Error(translations.i18n.t('environment_set_prevent_select_environment'));
      }

      const environment = environments.find(env => env.name === environmentName);
      if (!environment) {
        throw new Error(translations.i18n.t('environment_set_doesnt_exit'));
      }
    }

    context.updateEnvironmentName(environmentName);
  },

  describe: translations.i18n.t('environment_set_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args.usage(translations.i18n.t('environment_set_usage')).option('environmentName', {
      alias: 'n',
      describe: translations.i18n.t('environment_set_environment_name_describe'),
      type: 'string',
    }),
};
