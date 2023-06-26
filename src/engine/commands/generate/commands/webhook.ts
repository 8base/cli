import yargs from 'yargs';

import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { ExtensionType, SyntaxType } from '../../../../interfaces/Extensions';
import { ProjectController } from '../../../controllers/projectController';

type WebhookGenerateParams = {
  name: string;
  path?: string;
  method?: string;
  mocks: boolean;
  syntax: SyntaxType;
  silent: boolean;
};

export default {
  command: 'webhook <name>',

  handler: async (params: WebhookGenerateParams, context: Context) => {
    let { name, path, method, mocks, syntax, silent } = params;

    await ProjectController.generateFunction(
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
      .positional('name', {
        describe: translations.i18n.t('generate_webhook_name'),
        type: 'string',
      })
      .option('path', {
        alias: 'p',
        describe: translations.i18n.t('generate_webhook_path_describe'),
        type: 'string',
        requiresArg: true,
      })
      .option('method', {
        alias: 'm',
        describe: translations.i18n.t('generate_webhook_method_describe'),
        type: 'string',
        choices: ['POST', 'GET', 'DELETE', 'PUT'],
        requiresArg: true,
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
        requiresArg: true,
      })
      .option('silent', {
        describe: translations.i18n.t('silent_describe'),
        default: false,
        type: 'boolean',
      }),
};
