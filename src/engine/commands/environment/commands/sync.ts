/* eslint-disable no-console */
import yargs from 'yargs';
import chalk from 'chalk';
import { rimrafSync } from 'rimraf';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { ProjectConfigurationState } from '../../../../common/configuraion';
import { Interactive } from '../../../../common/interactive';
import { downloadProject } from '../../../../common/execute';
import tree from 'tree-node-cli';
import { green, bold } from 'picocolors';

import { globSync } from 'glob';

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

      console.log(green('\n' + bold('Starting process!')) + '\n');
      context.spinner.start(`We are checking your current project files... \n`);

      const files = globSync('*', { ignore: ['*.json', '*.yml'] });

      files.map(file => {
        rimrafSync(file);
      });

      context.spinner.start(`Downloading project files... \n`);

      await downloadProject(context, process.cwd(), {
        customEnvironment: environmentName,
      });

      const fileTree = tree(process.cwd(), {
        allFiles: true,
        exclude: [/node_modules/, /\.build/],
      });

      /* Print out tree of new project */
      context.logger.info(environmentName);
      context.logger.info(fileTree.replace(/[^\n]+\n/, ''));

      /* Print project created message */
      context.logger.info(`\n🎉 Environment ${green(environmentName)} was successfully updated 🎉\n`);
      context.logger.info(`⚠️  We recomend do a 8base deploy before continue working...\n`);
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
