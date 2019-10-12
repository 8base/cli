#!/usr/bin/env node

import * as yargs from "yargs";
import * as _ from "lodash";
import latestVersion from "latest-version";
import chalk from "chalk";

import { StaticConfig } from "./config";
import { Utils } from "./common/utils";
import { translations, Translations } from "./common/translations";

const pkg = require("../package.json");

const start = (translations: Translations) => {
  const argv = yargs
    .scriptName("8base")
    .usage(translations.i18n.t("8base_usage"))
    .commandDir(StaticConfig.commandsDir, {
      extensions: ["js", "ts"],
      recurse: true,
      visit: Utils.commandDirMiddleware(StaticConfig.commandsDir)
    } )
    .alias("version", "v")
    .option("v", {
      global: false
    })
    .option("debug", {
      alias: "d",
      describe: "Turn on debug logs",
      type: "boolean"
    })
    .recommendCommands()
    .strict()
    .fail((msg, err) => {
      // certain yargs validations throw strings :P
      const actual = err || new Error(msg);

      // ValidationErrors are already logged, as are package errors
      if (actual.name !== "ValidationError") {

        if (/Did you mean/.test(actual.message)) {
          console.error("Unknown command");
        }

        console.error(actual.message);
      }

      process.exit(0);
    })
    .detectLocale(false)
    .help()
    .alias("help", "h")
    .updateStrings({
      "Examples:": "EXAMPLES",
      "Commands:": "COMMANDS",
      "Options:": "OPTIONS"
    })
    .wrap(yargs.terminalWidth())
    .argv;

  if (!argv._[0]) {
    yargs.showHelp();
  }
};

translations.init()
  .then(async (translations: Translations) => {
    const last = await latestVersion(pkg.name);

    if (pkg.version !== last) {
      console.log(chalk.yellow(translations.i18n.t("8base_new_version", { last })));
    }

    start(translations);
  })
  .catch(err => console.error(err.message));
