import { Utils, StaticConfig } from "../../common";
import * as path from "path";
import * as _ from "lodash";
import * as fs from "fs";
import { Context } from "../../common/Context";
import { GraphQLError } from "graphql";


export class CommandController {

  private static instanceCommand(fullPath: string): any {
    try {
      try {
        return Utils.undefault(require(require.resolve(fullPath)));
      } catch(ex) {
        console.log(ex.message);
      }

    } catch (error) {
      throw new Error("Command \"" + path.basename(fullPath) + "\" is invalid");
    }
  }

  static parseError = (error: any) => {
    if (error.response) {
      console.log(error.response.errors);
    } else {
      console.log(error);
    }
  }

  static wrapHandler = (handler: Function) => {
    return async (params: any) => {
      const command = params._[0];


      const context = new Context(params);
      await context.init();

      try {

        const start = Date.now();
        await handler(params, context);
        const time = Date.now() - start;

        context.logger.info(context.i18n.t("success_command_end", { command, time }));

      } catch(ex) {
        context.logger.error(context.i18n.t("error_command_end", { error: CommandController.parseError(ex) }));
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
