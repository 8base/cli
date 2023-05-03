import yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { GraphqlAsyncActions } from '../../../../consts/GraphqlActions';
import { ProjectConfigurationState } from '../../../../common/configuraion';
import { executeAsync } from '../../../../common/execute';
import { MigrateMode } from '../../../../interfaces/Common';
import * as _ from 'lodash';
import errorCodes from '@8base/error-codes';
import { Interactive } from '../../../../common/interactive';

export default {
  command: 'branch',
  handler: async (params: { name: string; mode: MigrateMode; force: boolean }, context: Context) => {
    await ProjectConfigurationState.expectConfigured(context);
    const { name, mode, force } = params;
    context.spinner.start(context.i18n.t('environment_branch_in_progress'));

    try {
      await executeAsync(context, GraphqlAsyncActions.environmentBranch, {
        environmentName: name,
        mode,
        force: !!force,
      });
    } catch (e) {
      const message = isEnvironmentLimitReached(e);

      context.spinner.stop();
      const { confirm } = await Interactive.ask({
        name: 'confirm',
        type: 'confirm',
        message: message,
        initial: false,
      });

      if (!confirm) {
        throw new Error(translations.i18n.t('environment_branch_canceled'));
      }

      context.spinner.start(context.i18n.t('environment_branch_in_progress'));
      await executeAsync(context, GraphqlAsyncActions.environmentBranch, {
        environmentName: name,
        mode,
        force: true,
      });
    }

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
      })
      .option('force', {
        alias: 'f',
        describe: translations.i18n.t('environment_branch_force_describe'),
      }),
};

const isEnvironmentLimitReached = (e: any): string => {
  const err =
    !_.isEmpty(e.response?.errors) &&
    e.response.errors.find((err: any) => err.code === errorCodes.BillingPlanLimitWarningCode);
  if (!err || !err.message) {
    throw e;
  }

  return err.message;
};
