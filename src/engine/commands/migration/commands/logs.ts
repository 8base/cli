import * as yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import logs from '../../logs';

export default {
  command: 'logs',

  handler: async (params: any, context: Context) => {
    return logs.handler({ ...params, name: 'ci:migrate' }, context);
  },

  describe: translations.i18n.t('logs_migration_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('logs_usage'))
      .option('num', {
        alias: 'n',
        default: 10,
        describe: translations.i18n.t('logs_num_describe'),
        type: 'number',
      })
      .option('tail', {
        alias: 't',
        describe: translations.i18n.t('logs_tail_describe'),
        type: 'boolean',
      })
      .option('startTime', {
        alias: 's',
        describe: translations.i18n.t('logs_start_time_describe'),
        type: 'string',
      })
      .option('endTime', {
        alias: 'e',
        describe: translations.i18n.t('logs_end_time_describe'),
        type: 'string',
      }),
};
