import { debug, Utils, ExecutionConfig, StaticConfig } from "../../common";
import * as path from "path";
import * as _ from "lodash";
import * as fs from "fs";
import { CommandHandler } from "../../interfaces/IBaseCommand";
import { Context } from "../../common/Context";
import { GraphQLError } from "graphql";

export class CommandController {

  private static instanceCommand(fullPath: string): any {
    try {
      debug("try init command path = " + fullPath);
      return Utils.undefault(require(require.resolve(fullPath)));
    } catch (error) {
      debug(error);
      throw new Error("Command \"" + path.basename(fullPath) + "\" is invalid");
    }
  }

  static errorHandler = (error: any) => {
    console.log(JSON.stringify(error.response, null, 2));
    // if (error instanceof GraphQLError) {
    //   const gqlError = <GraphQLError>error;
    //   console.log(gqlError.nodes);
    // }
  }

  static wrapHandler = (handler: CommandHandler) => {
    return async (params: any) => {
      // try {
        await handler(params, new Context(params));
      // } catch(ex) {
      //   return CommandController.errorHandler(ex);
      // }
    };
  };

  // static async initialize(config: ExecutionConfig): Promise<any> {
  //   let fullPath = path.join(StaticConfig.commandsDir, config.command);
  //   debug("command manager: try to get command " + config.command + "; full path = " + fullPath);

  //   let cmd = this.instanceCommand(fullPath);
  //   await cmd.init(config);
  //   return cmd;
  // }

  // static async run(command: any) {
  //   debug("start run internal");

  //   if (_.isNil(command)) {
  //     return Promise.reject("Logic error: command not present");
  //   }

  //   return command.run();
  // }

  static enumerate(): any[] {
    return _.transform(fs.readdirSync(StaticConfig.commandsDir), (commands, file: string) => {
      const p = path.join(StaticConfig.commandsDir, file);
      if (fs.statSync(p).isDirectory()) {
        commands.push(this.instanceCommand(p));
      }
    }, []);
  }
}
