import * as yargs from 'yargs';
import chalk from 'chalk';

import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { StorageParameters } from '../../../../consts/StorageParameters';

export default {
  command: 'plan',

  handler: async (params: any, context: Context) => {
    const { workspaceId, environmentName } = context.workspaceConfig;

  },

  describe: translations.i18n.t('project_info_describe'),

  builder: (args: yargs.Argv): yargs.Argv => args.usage(translations.i18n.t('project_info_usage')),
};
