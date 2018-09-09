#!/usr/bin/env node

import { CommandController } from "./engine";
import * as yargs from "yargs";

yargs.usage("8base [command] [options]");

CommandController.enumerate()
  .map(cmd => {
    yargs.command({
      command: cmd.name,
      builder: cmd.builder,
      describe: cmd.describe,
      handler: CommandController.wrapHandler(cmd.handler)
    });
  }
);

yargs
  .alias('h', 'help')
  .alias('v', 'version')
  .argv;
