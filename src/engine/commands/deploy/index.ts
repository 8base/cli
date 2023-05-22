import yargs from 'yargs';
import * as _ from 'lodash';
import { Context } from '../../../common/context';
import { translations } from '../../../common/translations';
import { DeployModeType } from '../../../interfaces/Extensions';
import { executeDeploy } from '../../../common/execute';

type DeployParams = { plugins?: string[]; functions?: string[]; mode: DeployModeType };

export default {
  command: 'deploy',
  handler: async (params: DeployParams, context: Context) => {
    context.initializeProject();

    let deployOptions = { mode: params.mode };

    if (Array.isArray(params.plugins) && params.plugins.length > 0) {
      deployOptions = _.set(deployOptions, 'pluginNames', params.plugins);
    }

    if (Array.isArray(params.functions) && params.functions.length > 0) {
      deployOptions = _.set(deployOptions, 'extensionNames', params.functions);
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
      .option('functions', {
        alias: 'f',
        describe: translations.i18n.t('deploy_functions_describe'),
        type: 'array',
      })
      .option('mode', {
        alias: 'm',
        describe: translations.i18n.t('deploy_mode_describe'),
        default: DeployModeType.project,
        type: 'string',
        choices: Object.values(DeployModeType),
        requiresArg: true,
      }),
};
