import * as yargs from 'yargs';

import { Context } from '../../common/context';
import { translations } from '../../common/translations';
import { ExtensionType, SyntaxType } from '../../interfaces/Extensions';
import { ProjectController } from '../controllers/projectController';

type TaskParams = {
  name: string;
  path?: string;
  method?: string;
  mocks: boolean;
  syntax: SyntaxType;
  silent: boolean;
};

export default {
  command: 'webhook <name>',

  handler: async (params: TaskParams, context: Context) => {
    let { name, path, method, mocks, syntax, silent } = params;

    ProjectController.generateFunction(
      context,
      {
        type: ExtensionType.webhook,
        name,
        mocks,
        syntax,
        silent,
      },
      {
        path,
        method,
      },
    );
  },

  describe: translations.i18n.t('generate_webhook_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('generate_webhook_usage'))
      .option('path', {
        alias: 'p',
        describe: translations.i18n.t('generate_webhook_path_describe'),
        type: 'string',
      })
      .option('method', {
        alias: 'm',
        describe: translations.i18n.t('generate_webhook_method_describe'),
        type: 'string',
        choices: ['POST', 'GET', 'DELETE', 'PUT'],
      })
      .option('mocks', {
        alias: 'x',
        describe: translations.i18n.t('generate_mocks_describe'),
        default: true,
        type: 'boolean',
      })
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
