import * as yargs from "yargs";
import * as request from "request";
import * as path from "path";
import * as fs from "fs";
import * as rimraf from "rimraf";
import * as R from "ramda";

import { request as gqlRequest } from "graphql-request";
import gql from "graphql-tag";
import * as changeCase from "change-case";

import { Context } from "../../../../common/context";
import { translations } from "../../../../common/translations";
import { ProjectController } from "../../../controllers/projectController";

type PluginRemoveParams = {
  name: string,
};

export default {
  command: "remove [name]",

  handler: async (params: PluginRemoveParams, context: Context) => {
    const { name } = params;

    const pluginPath = `./plugins/${name}`;

    if (!fs.existsSync(pluginPath)) {
      throw new Error(translations.i18n.t("plugin_remove_plugin_not_found", { name }));
    }

    await (new Promise((resolve, reject) => {
      try {
        rimraf(path.resolve(pluginPath), {}, resolve);
      } catch (e) {
        reject(e);
      }
    }));

    let projectConfig = context.projectConfig;

    // @ts-ignore
    projectConfig = R.evolve({
      plugins: R.reject(R.propEq("name", name)),
    })(projectConfig);

    context.projectConfig = projectConfig;

    context.logger.info(context.i18n.t("plugin_successfully_remove", {
      name,
    }));
  },

  describe: translations.i18n.t("plugin_remove_describe"),

  builder: (args: yargs.Argv): yargs.Argv => args
    .usage(translations.i18n.t("plugin_remove_usage"))
    .positional("name", {
      describe: translations.i18n.t("plugin_remove_name_describe"),
      type: "string",
    })
    .demandOption("name"),
};
