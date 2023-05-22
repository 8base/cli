import yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { GraphqlActions } from '../../../../consts/GraphqlActions';
import { ProjectConfigurationState } from '../../../../common/configuraion';
import chalk from 'chalk';
import { Colors } from '../../../../consts/Colors';
import { table } from 'table';
import * as _ from 'lodash';
import { executeDeploy } from '../../../../common/execute';
import { DeployModeType } from '../../../../interfaces/Extensions';

type MigrationStatusParams = { environment?: string };

export default {
  command: 'status',

  handler: async (params: MigrationStatusParams, context: Context) => {
    await ProjectConfigurationState.expectHasProject(context);
    await executeDeploy(context, { mode: DeployModeType.migrations }, { customEnvironment: params.environment });
    context.spinner.start(context.i18n.t('migration_status_in_progress'));
    const { system } = await context.request(
      GraphqlActions.migrationStatus,
      {},
      { customEnvironment: params.environment },
    );
    const { status, migrations } = system.ciStatus;
    context.spinner.stop();
    context.logger.info(`${chalk.hex(Colors.green)('Status:')}: ${status}`);
    if (migrations && !_.isEmpty(migrations))
      context.logger.info(table([['migrations'], ...migrations.map((m: any) => [m])]));
  },

  describe: translations.i18n.t('migration_status_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args.usage(translations.i18n.t('migration_status_usage')).option('environment', {
      alias: 'e',
      describe: translations.i18n.t('migration_status_environment_describe'),
      type: 'string',
      requiresArg: true,
    }),
};
