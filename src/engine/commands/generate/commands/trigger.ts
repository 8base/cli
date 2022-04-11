import * as yargs from 'yargs';

import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { ExtensionType, SyntaxType, TriggerOperation, TriggerType } from '../../../../interfaces/Extensions';
import { ProjectController } from '../../../controllers/projectController';

type TriggerParams = {
  tableName: string;
  type?: string;
  operation?: string;
  mocks: boolean;
  syntax: SyntaxType;
  silent: boolean;
};

export default {
  command: 'trigger <tableName>',

  handler: async (params: TriggerParams, context: Context) => {
    const { tableName, type, operation, mocks, syntax, silent } = params;

    const operations: string[] = Object.values(TriggerOperation);
    if (operation && !operations.includes(operation)) {
      throw new Error(translations.i18n.t('generate_trigger_invalid_operation', { operations }));
    }

    ProjectController.generateFunction(
      context,
      {
        type: ExtensionType.trigger,
        name: tableName,
        mocks,
        syntax,
        silent,
      },
      {
        triggerTable: tableName,
        triggerFireOn: type,
        triggerOperation: operation,
      },
    );
  },

  describe: translations.i18n.t('generate_trigger_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('generate_trigger_usage'))
      // There is a suggestion to rename the "type" parameter to "fireOn".
      .option('type', {
        alias: 't',
        describe: translations.i18n.t('generate_trigger_type_describe'),
        type: 'string',
        choices: Object.values(TriggerType),
        default: TriggerType.before,
      })
      .option('operation', {
        alias: 'o',
        describe: translations.i18n.t('generate_trigger_operation_describe'),
        type: 'string',
        choices: Object.values(TriggerOperation),
        default: TriggerOperation.create,
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
