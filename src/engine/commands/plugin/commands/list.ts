import yargs from 'yargs';
import chalk from 'chalk';
import * as _ from 'lodash';
import gqlRequest from 'graphql-request';

import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { StaticConfig } from '../../../../config';

type PluginListParams = {
  query: string;
};

const PLUGINS_LIST_QUERY = `
  query PluginsList($query: String) {
    pluginsList(filter: { OR: { name: { contains: $query }, description: { contains: $query }, _fullText: $query } }) {
      items {
        name
        description
        gitHubUrl
      }
    }
  }
`;

export default {
  command: 'list',

  handler: async (params: PluginListParams, context: Context) => {
    const { query } = params;

    let plugins = await gqlRequest(`${StaticConfig.apiAddress}/ck16gpwki001f01jgh4kvd54j`, PLUGINS_LIST_QUERY, {
      query,
    });

    plugins = _.get(plugins, ['pluginsList', 'items']);

    if (Array.isArray(plugins) && plugins.length > 0) {
      plugins.forEach(({ name, description, gitHubUrl }: any) => {
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
