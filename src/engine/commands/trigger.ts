import * as yargs from 'yargs';

import { Context } from '../../common/context';
import { translations } from '../../common/translations';
import { ExtensionType, SyntaxType, TriggerOperation, TriggerType } from '../../interfaces/Extensions';
import { ProjectController } from '../controllers/projectController';

type TiggerParams = {
  name: string;
  type?: string;
  operation?: string;
  mocks: boolean;
  syntax: SyntaxType;
  silent: boolean;
};

export default {
  command: 'trigger <name>',

  handler: async (params: TiggerParams, context: Context) => {
    let { name, type, operation, mocks, syntax, silent } = params;

    if (operation && !/[\w\d]+\.(create|update|delete)/.test(operation)) {
      throw new Error(translations.i18n.t('generate_trigger_invalid_operation'));
    }

    ProjectController.generateFunction(
      context,
      {
        type: ExtensionType.trigger,
        name,
        mocks,
        syntax,
        silent,
      },
      {
        type,
        operation,
      },
    );
  },

  describe: translations.i18n.t('generate_trigger_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('generate_trigger_usage'))
      .option('type', {
        alias: 't',
        describe: translations.i18n.t('generate_trigger_type_describe'),
        type: 'string',
        choices: Object.values(TriggerType),
      })
      .option('operation', {
        alias: 'o',
        describe: translations.i18n.t('generate_trigger_operation_describe'),
        type: 'string',
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
