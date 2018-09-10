import { debug, Utils, StaticConfig } from "../../common";
import * as path from "path";
import * as _ from "lodash";
import * as fs from "fs";
import { Context } from "../../common/Context";
import { GraphQLError } from "graphql";


export class CommandController {

  private static instanceCommand(fullPath: string): any {
    try {
      debug("try init command path = " + fullPath);
      try {
        return Utils.undefault(require(require.resolve(fullPath)));
      } catch(ex) {
        console.log(ex.message);
      }

    } catch (error) {
      debug(error);
      throw new Error("Command \"" + path.basename(fullPath) + "\" is invalid");
    }
  }

  static errorHandler = (error: any) => {
    if (error instanceof GraphQLError) {
      console.log(error.message, null, 2);
    } else {
      console.log(error.message);
    }
  }

  static wrapHandler = (handler: Function) => {
    return async (params: any) => {
      try {
        await handler(params, new Context(params));
      } catch(ex) {
        return CommandController.errorHandler(ex);
      }
    };
  };

  static enumerate(): any[] {
    return _.transform(fs.readdirSync(StaticConfig.commandsDir), (commands, file: string) => {
      const p = path.join(StaticConfig.commandsDir, file);
      if (fs.statSync(p).isDirectory()) {
        commands.push(this.instanceCommand(p));
      }
    }, []);
  }
}
