import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { executeAsync, executeDeploy, uploadProject } from '../../../../common/execute';
import { GraphqlAsyncActions } from '../../../../consts/GraphqlActions';
import { ProjectConfigurationState } from '../../../../common/configuraion';
import { DeployModeType } from '../../../../interfaces/Extensions';
import { CommitMode, RequestOptions } from '../../../../interfaces/Common';
import { DEFAULT_ENVIRONMENT_NAME } from '../../../../consts/Environment';
import { Interactive } from '../../../../common/interactive';
import { StaticConfig } from '../../../../config';

export default {
  command: 'commit',
  handler: async (params: any, context: Context) => {
    ProjectConfigurationState.expectHasProject(context);
    context.initializeProject();

    const environment = params.environment ? params.environment : context.workspaceConfig.environmentName;

    if (environment === DEFAULT_ENVIRONMENT_NAME && !params.force) {
      const { confirm } = await Interactive.ask({
        name: 'confirm',
        type: 'confirm',
        message: translations.i18n.t('migration_commit_dest_env_master'),
        initial: false,
      });

      if (!confirm) {
        throw new Error(translations.i18n.t('migration_commit_canceled'));
      }
    }

    if (params.mode === CommitMode.ONLY_PROJECT && params.target) {
      throw new Error(context.i18n.t('migration_commit_in_project_mode'));
    }

    const migrationNames: string[] | undefined = params.target;

    if (migrationNames) {
      migrationNames.forEach(name => {
        if (!fs.existsSync(path.join(StaticConfig.rootExecutionDir, 'migrations', name))) {
          throw new Error(context.i18n.t('migration_commit_file_does_not_exist', { name }));
        }
      });
    }

    const options: RequestOptions = { customEnvironment: environment };
    await executeDeploy(context, { mode: DeployModeType.migrations }, options);

    context.spinner.start(context.i18n.t('migration_commit_in_progress'));

    const { buildName } =
      params.mode === CommitMode.ONLY_PROJECT || params.mode === CommitMode.FULL
        ? await uploadProject(context, options)
        : { buildName: null };

    await executeAsync(
      context,
      GraphqlAsyncActions.commit,
      { mode: params.mode, build: buildName, migrationNames: migrationNames },
      { customEnvironment: environment },
    );

    context.spinner.stop();
  },
  describe: translations.i18n.t('migration_commit_describe'),
  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('migration_commit_usage'))
      .option('mode', {
        alias: 'm',
        describe: translations.i18n.t('migration_commit_mode_describe'),
        default: CommitMode.FULL,
        type: 'string',
        choices: Object.values(CommitMode),
      })
      .option('force', {
        alias: 'f',
        describe: translations.i18n.t('migration_force_describe'),
      })
      .option('environment', {
        alias: 'e',
        describe: translations.i18n.t('migration_environment_describe'),
        type: 'string',
      })
      .option('target', {
        alias: 't',
        describe: translations.i18n.t('migration_commit_select_file_describe'),
        type: 'array',
      }),
};
