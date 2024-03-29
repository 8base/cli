import yargs from 'yargs';

import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { SyntaxType } from '../../../../interfaces/Extensions';
import { ProjectController } from '../../../controllers/projectController';

type PluginGenerateParams = {
  name: string;
  mocks: boolean;
  syntax: SyntaxType;
  silent: boolean;
};

export default {
  command: 'plugin <name>',

  handler: async (params: PluginGenerateParams, context: Context) => {
    let { name, syntax } = params;

    await ProjectController.generatePlugin(context, {
      name,
      syntax,
    });
  },

  describe: translations.i18n.t('generate_plugin_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('generate_plugin_usage'))
      .positional('name', {
        describe: translations.i18n.t('generate_plugin_name'),
        type: 'string',
      })
      .option('syntax', {
        alias: 's',
        describe: translations.i18n.t('generate_syntax_describe'),
        default: 'ts',
        type: 'string',
        choices: Object.values(SyntaxType),
        requiresArg: true,
      })
      .option('silent', {
        describe: translations.i18n.t('silent_describe'),
        default: false,
        type: 'boolean',
      }),
};
