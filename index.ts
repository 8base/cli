#!/usr/bin/env node

import * as yargs from "yargs";
import { CommandController } from "./engine/controllers/commandController";
import {  Translations } from "./common/Context";

const start = (translations: Translations) => {
  yargs.usage("Usage: 8base <command> [OPTIONS]");

  CommandController.enumerate()
    .map(cmd => {
      yargs.command({
        command: cmd.name,
        builder: CommandController.wrapBuilder(cmd.builder, translations),
        describe: cmd.describe,
        handler: CommandController.wrapHandler(cmd.handler, translations)
      })
      .option('d', {
        hidden: true
      });
    }
  );

  yargs
    .alias('h', 'help')
    .option('h', {
      global: false
    })
    .alias('v', 'version')
    .option('v', {
      global: false
    })
    .option('d', {
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

};

const translations = new Translations();
translations.init()
  .then((translations: Translations) => {
    start(translations);
  })
  .catch(err => console.error(err.message));

