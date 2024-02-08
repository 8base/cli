import yargs from 'yargs';

import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { ExtensionType, SyntaxType, TriggerOperation, TriggerType } from '../../../../interfaces/Extensions';
import { ProjectController } from '../../../controllers/projectController';

type TriggerGenerateParams = {
  tableName: string;
  type: TriggerType;
  operation: TriggerOperation;
  mocks: boolean;
  syntax: SyntaxType;
  silent: boolean;
};

export default {
  command: 'trigger <tableName>',

  handler: async (params: TriggerGenerateParams, context: Context) => {
    const { tableName, type, operation, mocks, syntax, silent } = params;

    await ProjectController.generateFunction(
      context,
      {
        type: ExtensionType.trigger,
        name: tableName,
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
      .positional('tableName', {
        describe: translations.i18n.t('generate_trigger_table_name'),
        type: 'string',
      })
      .option('type', {
        alias: 't',
        describe: translations.i18n.t('generate_trigger_type_describe'),
        type: 'string',
        choices: Object.values(TriggerType),
        requiresArg: true,
        default: TriggerType.before,
      })
      .option('operation', {
        alias: 'o',
        describe: translations.i18n.t('generate_trigger_operation_describe'),
        type: 'string',
        choices: Object.values(TriggerOperation),
        default: TriggerOperation.create,
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
