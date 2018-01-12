import { trace } from "./tracer";
import { CommandManager } from "../engine";

export function printHelp() {    
    trace("\n8base command line usage: ");
    CommandManager.enumerate().map((cmd) => {
        trace("     " + cmd.description());
    });
}