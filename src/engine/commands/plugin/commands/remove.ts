import yargs from 'yargs';
import * as fs from 'fs-extra';
import _ from 'lodash';

import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';

type PluginRemoveParams = {
  name: string;
};

export default {
  command: 'remove <name>',

  handler: async (params: PluginRemoveParams, context: Context) => {
    const { name } = params;

    const pluginPath = `./plugins/${name}`;

    if (!(await fs.exists(pluginPath))) {
      throw new Error(translations.i18n.t('plugin_remove_plugin_not_found', { name }));
    }

    await fs.remove(pluginPath);

    const projectConfig = context.projectConfig;
    _.remove(projectConfig.plugins, plugin => plugin.name === name);

    context.logger.info(
      context.i18n.t('plugin_successfully_remove', {
        name,
      }),
    );
  },

  describe: translations.i18n.t('plugin_remove_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args.usage(translations.i18n.t('plugin_remove_usage')).positional('name', {
      describe: translations.i18n.t('plugin_remove_name_describe'),
      type: 'string',
    }),
};
