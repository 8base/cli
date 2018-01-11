import { ExecutionConfig, StaticConfig } from "../common";
import { debug, trace } from "../common";
import * as path from 'path';
import * as _ from "lodash";
import { undefault } from "../common";
import * as fs from "fs";

export class CommandManager {

    private static instanceCommand(fullPath: string): any {
        let Command = undefault(require(require.resolve(fullPath)));
        return new Command();
    }

    static initialize(config: ExecutionConfig): any {
        let fullPath = path.join(StaticConfig.commandsDir, config.command);
        debug("command manager: try to get command " + config.command + "; full path = " + fullPath);

        let cmd = CommandManager.instanceCommand(fullPath);
        cmd.init(config);
        return cmd;
    }

    static async run(command: any) {
        debug("start run internal");

        if (_.isNil(command)) {
            return Promise.reject("Logic error: command not present");
        }

        await command.run();

        debug("run command success");
    }

    static enumerate(): any[] {
        return _.transform(fs.readdirSync(StaticConfig.commandsDir), (commands, file) => {
            const p = path.join(StaticConfig.commandsDir, file);
            if (fs.statSync(p).isDirectory()) {
                commands.push(CommandManager.instanceCommand(p));
            }
        }, []);
    }
}
