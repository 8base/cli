import * as yargs from 'yargs';
import * as _ from 'lodash';
import { GraphqlController } from '../../controllers/graphqlController';
import { Context } from '../../../common/context';
import { translations } from '../../../common/translations';
import { DeployModeType } from '../../../interfaces/Extensions';
import { executeDeploy } from '../../../common/execute';

export default {
  command: 'deploy',
  handler: async (params: any, context: Context) => {
    context.initializeProject();

    if (params['validate_schema']) {
      GraphqlController.validateSchema(context.project);
    }

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
      }),
};
