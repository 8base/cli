import { trace, debug } from "../../../common";
import { provideFiles } from "./providers";
import { BaseCommand } from "../base";
import { ExecutionConfig } from "../../../engine";

class Init extends BaseCommand {

    protected usageSpecific(): string {
        throw new Error("Method not implemented.");
    }

    name(): string {
        return "init";
    }

    init(config: ExecutionConfig) {
       trace("initiailie init command");
    }

    async run() {

        let files = await provideFiles();
        debug("files to install:");
        debug(files);
    }
}
