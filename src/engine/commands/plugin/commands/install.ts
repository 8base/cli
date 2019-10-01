import * as yargs from "yargs";
import * as request from "request";
import * as path from "path";
import * as _ from "lodash";
import * as AdmZip from "adm-zip";
import { request as gqlRequest } from "graphql-request";
import gql from "graphql-tag";
import * as changeCase from "change-case";

import { Context } from "../../../../common/context";
import { translations } from "../../../../common/translations";
import { ProjectController } from "../../../controllers/projectController";

type PluginInstallParams = {
  name: string,
};

const PLUGINS_LIST_QUERY = gql`
  query PluginsList {
    pluginsList {
      items {
        name
        gitHubUrl
      }
    }
  }
`;

export default {
  command: "install [name]",

  handler: async (params: PluginInstallParams, context: Context) => {
    const { name } = params;

    let plugins = await gqlRequest("https://api.8base.com/ck16gpwki001f01jgh4kvd54j", PLUGINS_LIST_QUERY);

    plugins = _.get(plugins, ["pluginsList", "items"]);

    // @ts-ignore
    const plugin = _.find(plugins, { name });

    if (!plugin) {
      throw new Error(context.i18n.t("plugin_install_cant_find", {
        name,
      }));
    }

    await (new Promise((resolve, reject) => {
      request({
        url: `${plugin.gitHubUrl}/archive/master.zip`,
        method: "GET",
        encoding: null,
      }, (err, response, body) => {
        if (err) {
          throw new Error(context.i18n.t("plugin_install_cant_download", {
            name,
          }));
        }

        try {
          const zip = new AdmZip(body);

          const zipEntries = zip.getEntries();

          zipEntries.forEach((zipEntry: any) => {
            if (!zipEntry.isDirectory) {
              let targetPath = zipEntry.entryName.replace(/^[^\/]+\//, "");

              const filePath = `plugins/${name}/${targetPath}`;

              targetPath = targetPath.replace(/\/?[^\/]+$/, "");

              targetPath = path.resolve(`./plugins/${name}/${targetPath}`);

              zip.extractEntryTo(zipEntry.entryName, targetPath, false, true);

              context.logger.info(context.i18n.t("project_created_file", {
                path: filePath,
              }));
            }
          });

          ProjectController.addPluginDeclaration(context, changeCase.camelCase(name), {
            name,
            path: `plugins/${name}/8base.yml`,
          }, ".");
        } catch (e) {
          reject(e);
        }

        resolve();
      });
    }));

    context.logger.info(context.i18n.t("plugin_successfully_install", {
      name,
    }));
  },

  describe: translations.i18n.t("plugin_install_describe"),

  builder: (args: yargs.Argv): yargs.Argv => args
    .usage(translations.i18n.t("plugin_install_usage"))
    .positional("name", {
      describe: translations.i18n.t("plugin_install_name_describe"),
      type: "string",
    })
    .demandOption("name"),
};
