import * as yargs from 'yargs';

import { Context } from '../../common/context';
import { translations } from '../../common/translations';
import { SyntaxType } from '../../interfaces/Extensions';
import { ProjectController } from '../controllers/projectController';

type ResolverParams = {
  name: string;
  mocks: boolean;
  syntax: SyntaxType;
  silent: boolean;
};

export default {
  command: 'plugin <name>',

  handler: async (params: ResolverParams, context: Context) => {
    let { name, syntax, silent } = params;

    ProjectController.generatePlugin(context, {
      name,
      syntax,
    });
  },

  describe: translations.i18n.t('generate_plugin_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('generate_plugin_usage'))
      .option('syntax', {
        alias: 's',
        describe: translations.i18n.t('generate_syntax_describe'),
        default: 'ts',
        type: 'string',
        choices: Object.values(SyntaxType),
      })
      .option('silent', {
        describe: translations.i18n.t('silent_describe'),
        default: false,
        type: 'boolean',
      }),
};
