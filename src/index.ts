#!/usr/bin/env node

import * as yargs from "yargs";
import * as path from "path";
import * as _ from "lodash";
import { CommandController } from "./engine/controllers/commandController";
import { StaticConfig } from "./config";

import { translations, Translations } from "./common/translations";

const start = (translations: Translations) => {
  const argv = yargs
    .scriptName("8base")
    .usage(translations.i18n.t("8base_usage"))
    .commandDir(StaticConfig.commandsDir, {
      extensions: ["js", "ts"],
      recurse: true,
      visit: (commandObject, pathName) => {
        const mathedFolderRegExp = new RegExp(
          path
            .join(StaticConfig.commandsDir, "/[^\/]*/[^\/]*.(t|j)s")
            .replace(/\//ig, "\\\/")
        );

        const cmd = commandObject.default || commandObject;

        if (mathedFolderRegExp.test(pathName) && !!cmd.command) {
          return {
            ...cmd,
            handler: CommandController.wrapHandler(cmd.handler, translations)
          };
        }
      }
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
    .demandCommand()
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
