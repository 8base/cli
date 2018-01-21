import { trace } from "./tracer";
import { CommandController } from "../engine";

export function printHelp() {
    trace("\n8base command line usage: ");
    CommandController.enumerate().map((cmd) => {
        trace("     " + cmd.description());
    });
}