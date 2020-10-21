import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { executeAsync, executeDeploy, uploadProject } from '../../../../common/execute';
import { GraphqlAsyncActions } from '../../../../consts/GraphqlActions';
import { ProjectConfigurationState } from '../../../../common/configuraion';
import { DeployModeType } from '../../../../interfaces/Extensions';
import * as yargs from 'yargs';
import { CommitMode, MigrateMode } from '../../../../interfaces/Common';

export default {
  command: 'commit',
  handler: async (params: any, context: Context) => {
    ProjectConfigurationState.expectHasProject(context);
    context.initializeProject();
    await executeDeploy(context, { mode: DeployModeType.migrations });

    context.spinner.start(context.i18n.t('migration_commit_in_progress'));

    const { buildName } =
      params.mode === CommitMode.ONLY_MIGRATIONS || params.mode === CommitMode.FULL
        ? await uploadProject(context)
        : { buildName: null };

    await executeAsync(context, GraphqlAsyncActions.commit, {
      environment: params.environment,
      mode: params.mode,
      build: buildName,
    });
    context.spinner.stop();
  },
  describe: translations.i18n.t('migration_commit_describe'),
  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('migration_commit_usage'))
      .option('mode', {
        alias: 'm',
        describe: translations.i18n.t('migration_commit_mode_describe'),
        default: CommitMode.ONLY_MIGRATIONS,
        type: 'string',
        choices: Object.values(CommitMode),
      })
      .option('environment', {
        alias: 'e',
        describe: translations.i18n.t('migration_environment_describe'),
        type: 'string',
      }),
};
