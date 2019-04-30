#!/usr/bin/env node

import * as yargs from "yargs";
import * as path from "path";
import * as _ from "lodash";
import { StaticConfig } from "./config";
import { Utils } from "./common/utils";
import { translations, Translations } from "./common/translations";

const start = (translations: Translations) => {
  const argv = yargs
    .scriptName("8base")
    .usage(translations.i18n.t("8base_usage"))
    .commandDir(StaticConfig.commandsDir, {
      extensions: ["js", "ts"],
      recurse: true,
      visit: Utils.commandDirMiddleware(StaticConfig.commandsDir)
    } )
    .alias("help", "h")
    .option("help", {
      global: false
    })
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
    .argv;

  if (!argv._[0]) {
    yargs.showHelp();
  }
};

translations.init()
  .then((translations: Translations) => {
    start(translations);
  })
  .catch(err => console.error(err.message));
