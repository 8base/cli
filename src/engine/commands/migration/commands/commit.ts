import * as fs from 'fs-extra';
import * as path from 'path';
import yargs from 'yargs';
import * as _ from 'lodash';
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

type MigrationCommitParams = { mode: CommitMode; force?: boolean; environment?: string; target?: string[] };

export default {
  command: 'commit',
  handler: async (params: MigrationCommitParams, context: Context) => {
    await ProjectConfigurationState.expectHasProject(context);
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

    const migrationNames: string[] = params.target;

    if (!_.isEmpty(migrationNames)) {
      await Promise.all(
        migrationNames.map(async name => {
          if (!(await fs.exists(path.join(StaticConfig.rootExecutionDir, 'migrations', name)))) {
            throw new Error(context.i18n.t('migration_commit_file_does_not_exist', { name }));
          }
        }),
      );
    }

    const options: RequestOptions = {
      customEnvironment: environment,
      nodeVersion: context?.projectConfig?.settings?.nodeVersion.toString(),
    };
    await executeDeploy(context, { mode: DeployModeType.migrations }, options);

    context.spinner.start(context.i18n.t('migration_commit_in_progress'));

    const { buildName } =
      params.mode === CommitMode.ONLY_PROJECT || params.mode === CommitMode.FULL
        ? await uploadProject(context, options)
        : { buildName: null };

    await executeAsync(
      context,
      GraphqlAsyncActions.commit,
      {
        mode: params.mode,
        build: buildName,
        migrationNames: migrationNames,
        nodeVersion: context?.projectConfig?.settings?.nodeVersion.toString(),
      },
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
        requiresArg: true,
      })
      .option('force', {
        alias: 'f',
        describe: translations.i18n.t('migration_force_describe'),
        type: 'boolean',
      })
      .option('environment', {
        alias: 'e',
        describe: translations.i18n.t('migration_environment_describe'),
        type: 'string',
        requiresArg: true,
      })
      .option('target', {
        alias: 't',
        describe: translations.i18n.t('migration_commit_select_file_describe'),
        type: 'array',
      }),
};
