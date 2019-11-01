import * as yargs from "yargs";
import chalk from "chalk";
import * as _ from "lodash";
import { request as gqlRequest } from "graphql-request";
import gql from "graphql-tag";

import { Context } from "../../../../common/context";
import { translations } from "../../../../common/translations";

type PluginListParams = {
  q: string,
};

const PLUGINS_LIST_QUERY = gql`
  query PluginsList($q: String) {
    pluginsList(filter: {
      OR: {
        name: {
          contains: $q,
        },
        description: {
          contains: $q
        },
        _fullText: $q,
      }
    }) {
      items {
        name
        description
        gitHubUrl
      }
    }
  }
`;

export default {
  command: "list",

  handler: async (params: PluginListParams, context: Context) => {
    const { q } = params;

    let plugins = await gqlRequest("https://api.8base.com/ck16gpwki001f01jgh4kvd54j", PLUGINS_LIST_QUERY, { q });

    plugins = _.get(plugins, ["pluginsList", "items"]);

    if (Array.isArray(plugins) && plugins.length > 0) {
      plugins.forEach(({ name, description, gitHubUrl }: any) => {
        context.logger.info(context.i18n.t("plugin_list_plugin_info", { name: chalk.green(name), description, gitHubUrl }));
      });
    } else {
      context.logger.info(context.i18n.t("plugin_list_not_found_plugins"));
    }
  },

  describe: translations.i18n.t("plugin_list_describe"),

  builder: (args: yargs.Argv): yargs.Argv => args
    .usage(translations.i18n.t("plugin_list_usage"))
    .option("query", {
      alias: "q",
      type: "string",
    }),
};
