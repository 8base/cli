import { ExecutionConfig } from "./config";
import { trace, debug } from "../common";
import * as _ from "lodash";

export async function run(command: any) {
    debug("start run internal");

    for(let i = 0; i < 100000000; ++i) {
        trace(i);
    }

    if (_.isNil(command)) {
        return Promise.reject("ko");
    }

    await command.run();

    debug("get command success");
}