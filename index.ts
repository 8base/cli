#!/usr/bin/env node

import { CommandManager } from "./engine";
import { trace, printHelp, debug, ExecutionConfig } from "./common";


// print copyright ?
trace("Welcome to 8base command line interface");

let command;

try {
    let config = new ExecutionConfig(process.argv);

    command = CommandManager.initialize(config);
}
catch(err) {
    debug("Initialize error = " + err.message);
    printHelp();
    process.exit(0);
}

CommandManager.run(command)
    .then(() => trace("Execution complete successfull"))
    .catch(err => { trace(err); });