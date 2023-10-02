import yargs from 'yargs';
import chalk from 'chalk';
import { rimrafSync } from 'rimraf';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { ProjectConfigurationState } from '../../../../common/configuraion';
import { Interactive } from '../../../../common/interactive';
import { downloadProject } from '../../../../common/execute';

import { glob, globSync, globStream, globStreamSync, Glob } from 'glob';

export default {
  command: 'sync',

  handler: async (params: {}, context: Context) => {
    await ProjectConfigurationState.expectConfigured(context);
    const { environmentName } = context.workspaceConfig;

    let warningApproval: Boolean;

    ({ warningApproval } = await Interactive.ask({
      name: 'warningApproval',
      type: 'select',
      message: translations.i18n.t('environment_sync_warning', {
        environment: chalk.green(environmentName),
      }),
      choices: [
        {
          title: 'Yes',
          value: true,
        },
        {
          title: 'No',
          value: false,
        },
      ],
    }));

    if (warningApproval) {
      const files = globSync('*', { ignore: ['*.json', '*.yml'] });

      files.map(file => {
        rimrafSync(file);
      });

      context.logger.info('downloading project files.');

      await downloadProject(context, '.', {
        customEnvironment: environmentName,
      });
    }

    context.logger.info(
      translations.i18n.t('environment_sync_text', {
        environment: chalk.green(environmentName),
      }),
    );
  },

  describe: translations.i18n.t('environment_sync_describe'),

  builder: (args: yargs.Argv): yargs.Argv => args.usage(translations.i18n.t('environment_sync_usage')),
};
