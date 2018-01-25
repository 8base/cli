import { debug, trace, Utils, ExecutionConfig, StaticConfig } from "../../common";
import * as path from "path";
import * as _ from "lodash";
import * as fs from "fs";

export class CommandController {

    private static instanceCommand(fullPath: string): any {
        try {
            debug("try init command path = " + fullPath);
            const Command = Utils.undefault(require(require.resolve(fullPath)));
            return new Command();
        } catch (error) {
            debug(error);
            throw new Error("Command \"" + path.basename(fullPath) + "\" is invalid");
        }
    }

    static async initialize(config: ExecutionConfig): Promise<any> {
        let fullPath = path.join(StaticConfig.commandsDir, config.command);
        debug("command manager: try to get command " + config.command + "; full path = " + fullPath);

        let cmd = this.instanceCommand(fullPath);
        await cmd.init(config);
        return cmd;
    }

    static async run(command: any) {
        debug("start run internal");

        if (_.isNil(command)) {
            return Promise.reject("Logic error: command not present");
        }

        return command.run();
    }

    static enumerate(): any[] {
        return _.transform(fs.readdirSync(StaticConfig.commandsDir), (commands, file:string) => {
            const p = path.join(StaticConfig.commandsDir, file);
            if (fs.statSync(p).isDirectory()) {
                commands.push(this.instanceCommand(p));
            }
        }, []);
    }
}
