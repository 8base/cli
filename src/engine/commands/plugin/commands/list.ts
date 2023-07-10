import yargs from 'yargs';
import chalk from 'chalk';
import _ from 'lodash';

import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { StaticConfig } from '../../../../config';
import { DEFAULT_ENVIRONMENT_NAME } from '../../../../consts/Environment';

type PluginListParams = {
  query: string;
};

const PLUGINS_LIST_QUERY = `
  query PluginsList($query: String) {
    pluginsList(filter: {
      OR: [
        {
          name: {
            contains: $query
          }
        },
        {
          description: {
            contains: $query
          }
        },
        { _fullText: $query }
      ]
    }) {
      items {
        name
        description
        gitHubUrl
      }
    }
  }
`;

type ProjectType = { name: string; description: string; gitHubUrl: string };

export default {
  command: 'list',

  handler: async (params: PluginListParams, context: Context) => {
    let plugins = _.get(
      await context.request<PluginListParams, { pluginsList: { items: ProjectType[] } }>(PLUGINS_LIST_QUERY, params, {
        customWorkspaceId: StaticConfig.pluginsWorkspaceId,
        customEnvironment: DEFAULT_ENVIRONMENT_NAME,
      }),
      ['pluginsList', 'items'],
    );

    if (Array.isArray(plugins) && plugins.length > 0) {
      plugins.forEach(({ name, description, gitHubUrl }) => {
        context.logger.info(
          context.i18n.t('plugin_list_plugin_info', { name: chalk.green(name), description, gitHubUrl }),
        );
      });
    } else {
      context.logger.info(context.i18n.t('plugin_list_not_found_plugins'));
    }
  },

  describe: translations.i18n.t('plugin_list_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args.usage(translations.i18n.t('plugin_list_usage')).option('query', {
      alias: 'q',
      type: 'string',
      requiresArg: true,
    }),
};
