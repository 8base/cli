import * as yargs from 'yargs';

import { Context } from '../../common/context';
import { translations } from '../../common/translations';
import { ExtensionType, SyntaxType } from '../../interfaces/Extensions';
import { ProjectController } from '../controllers/projectController';

type TaskParams = {
  name: string;
  schedule?: string;
  mocks: boolean;
  syntax: SyntaxType;
  silent: boolean;
};

export default {
  command: 'task <name>',

  handler: async (params: TaskParams, context: Context) => {
    let { name, schedule, mocks, syntax, silent } = params;

    ProjectController.generateFunction(
      context,
      {
        type: ExtensionType.task,
        name,
        mocks,
        syntax,
        silent,
      },
      {
        schedule,
      },
    );
  },

  describe: translations.i18n.t('generate_task_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('generate_task_usage'))
      .option('schedule', {
        alias: 'sch',
        describe: translations.i18n.t('generate_task_schedule_describe'),
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
