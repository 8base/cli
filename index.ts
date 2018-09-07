#!/usr/bin/env node

import { CommandController } from "./engine";
import * as yargs from "yargs";



CommandController.enumerate().map(cmd => {
  yargs.command({
    command: cmd.name,
    describe: cmd.describe,
    handler: CommandController.wrapHandler(cmd.handler)
  });
});

yargs.argv;