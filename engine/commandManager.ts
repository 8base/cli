import { ExecutionConfig } from "./config";
import { debug, trace } from "../common";
import * as path from 'path';

export function initializeCommand(config: ExecutionConfig): any {
    let fullPath = path.join(config.commandsDir, config.command);
    debug("command manager: try to get command " + config.command + "; full path = " + fullPath);
    let command = require(require.resolve(fullPath));

    new command();
    command.init(config);

    return command;
}