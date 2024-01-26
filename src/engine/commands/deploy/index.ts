import yargs from 'yargs';
import * as _ from 'lodash';
import { Context } from '../../../common/context';
import { translations } from '../../../common/translations';
import { DeployModeType } from '../../../interfaces/Extensions';
import { Utils } from '../../../common/utils';
import { executeDeploy } from '../../../common/execute';
import { Interactive } from '../../../common/interactive';

type DeployParams = { plugins?: string[]; mode: DeployModeType; forceNodeChange?: boolean };

export default {
  command: 'deploy',
  handler: async (params: DeployParams, context: Context) => {
    context.initializeProject();
    const remoteRuntime = await context?.functionCheck();
    const remoteVersion = remoteRuntime?.version?.match(/\d+/)?.[0];
    let confirmChangeVersion;

    let deployOptions = {
      mode: params.mode,
      nodeVersion: context?.projectConfig?.settings?.nodeVersion.toString(),
    };

    if (Array.isArray(params.plugins) && params.plugins.length > 0) {
      context.logger.debug('upload source code complete');
      deployOptions = _.set(deployOptions, 'pluginNames', params.plugins);
    }

    const isOldProject = !context?.workspaceConfig?.cli_Version && remoteRuntime.version === 'not found';

    if (!Utils.validateExistNodeVersion(context, isOldProject)) {
      deployOptions = _.set(deployOptions, 'pluginNames', params.plugins);
      deployOptions = _.set(deployOptions, 'nodeVersion', context.projectConfig.settings.nodeVersion.toString());
      throw new Error(translations.i18n.t(translations.i18n.t('deploy_node_version_warning')));
    }

    if (params?.forceNodeChange) {
      context.logger.info(translations.i18n.t('deploy_node_version_warning_message'));
      deployOptions = _.set(deployOptions, 'nodeVersion', context.projectConfig.settings.nodeVersion?.toString());
      await executeDeploy(context, deployOptions);
      return;
    }

    if (
      remoteVersion !== context.projectConfig?.settings?.nodeVersion.toString() &&
      remoteRuntime.version !== 'not found'
    ) {
      ({ confirmChangeVersion } = await Interactive.ask({
        name: 'confirmChangeVersion',
        type: 'confirm',
        message: translations.i18n.t('confirm_deploy_node_version_warning_message'),
        initial: false,
      }));
      if (!confirmChangeVersion) {
        throw new Error(translations.i18n.t(translations.i18n.t('deploy_cancelled')));
      }
    }

    await executeDeploy(context, deployOptions);
  },

  describe: translations.i18n.t('deploy_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('deploy_usage'))
      .option('plugins', {
        alias: 'p',
        describe: translations.i18n.t('deploy_plugins_describe'),
        type: 'array',
      })
      .option('mode', {
        alias: 'm',
        describe: translations.i18n.t('deploy_mode_describe'),
        default: DeployModeType.project,
        type: 'string',
        choices: Object.values(DeployModeType),
        requiresArg: true,
      })
      .option('forceNodeChange', {
        alias: 'f',
        describe: translations.i18n.t('deploy_forcenodeversion_describe'),
        type: 'boolean',
        requiresArg: false,
      }),
};
