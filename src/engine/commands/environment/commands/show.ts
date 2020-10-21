import * as yargs from 'yargs';
import chalk from 'chalk';

import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { ProjectConfigurationState } from '../../../../common/configuraion';

export default {
  command: 'show',

  handler: async (params: any, context: Context) => {
    ProjectConfigurationState.expectConfigured(context);
    const { environmentName } = context.workspaceConfig;
    context.logger.info(
      translations.i18n.t('environment_show_text', {
        environment: chalk.green(environmentName),
      }),
    );
  },

  describe: translations.i18n.t('project_info_describe'),

  builder: (args: yargs.Argv): yargs.Argv => args.usage(translations.i18n.t('project_info_usage')),
};
