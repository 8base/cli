#!/usr/bin/env node

import * as yargs from "yargs";
import { CommandController } from "./engine/controllers/commandController";
import { translations, Translations } from "./common/translations";

const start = (translations: Translations) => {
  yargs.usage(translations.i18n.t("8base_usage"));

  yargs.scriptName("8base");

  CommandController.enumerate()
    .map(cmd => {
      yargs.command({
        command: cmd.name,
        builder: cmd.builder,
        describe: cmd.describe,
        handler: CommandController.wrapHandler(cmd.handler, translations)
      })
      .option("d", {
        hidden: true
      });
    }
  );

  const argv = yargs
    .alias("h", "help")
    .option("h", {
      global: false
    })
    .alias("v", "version")
    .option("v", {
      global: false
    })
    .option("d", {
      alias: "debug",
      describe: "turn on debug logs",
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

