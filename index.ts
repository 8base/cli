#!/usr/bin/env node

import { run, ExecutionConfig, initializeCommand } from "./engine";
import { trace, printHelp } from "./common";


// print copyright ?
trace("start execution");

let command;

try {
    let config = new ExecutionConfig(process.argv);

    trace("initialize command");

    command = initializeCommand(config);
}
catch(err) {
    printHelp();
    throw err;
}

run(command)
    .then(() => trace("execution complete successfull"))
    .catch(err => { trace(err); });