import * as yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { GraphqlAsyncActions } from '../../../../consts/GraphqlActions';
import { ProjectConfigurationState } from '../../../../common/configuraion';
import { executeAsync } from '../../../../common/execute';
import { MigrateMode } from '../../../../interfaces/Common';

export default {
  command: 'branch',
  handler: async (params: any, context: Context) => {
    await ProjectConfigurationState.expectConfigured(context);
    let { name, mode } = params;
    context.spinner.start(context.i18n.t('environment_branch_in_progress'));
    await executeAsync(context, GraphqlAsyncActions.environmentBranch, { environmentName: name, mode });
    context.spinner.stop();

    context.updateEnvironmentName(name);
  },

  describe: translations.i18n.t('environment_branch_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('environment_branch_usage'))
      .option('name', {
        alias: 'n',
        describe: translations.i18n.t('environment_branch_name_describe'),
        type: 'string',
        demandOption: true,
      })
      .option('mode', {
        alias: 'm',
        describe: translations.i18n.t('environment_branch_mode_describe'),
        default: MigrateMode.FULL,
        type: 'string',
        choices: Object.values(MigrateMode),
      }),
};
