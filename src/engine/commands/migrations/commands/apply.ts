import * as yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';

export default {
  command: 'apply',

  handler: async (params: any, context: Context) => {
  },

  describe: translations.i18n.t('project_info_describe'),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("clone_usage"))
  }
};
