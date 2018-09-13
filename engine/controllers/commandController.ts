import { Utils, StaticConfig } from "../../common";
import * as path from "path";
import * as _ from "lodash";
import * as fs from "fs";
import { Translations } from "../../common/translations";
import { Context } from "../../common/context";
import * as yargs from "yargs";
import chalk from "chalk";


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
    if (error.response && error.response.errors.length > 0 && error.response.errors[0].message) {
      const internalError = error.response.errors[0];
      if (internalError.details) {
        const keys = Object.keys(internalError.details);
        if (keys.length > 0) {
          return internalError.details[keys[0]];
        }
      }
      return internalError.message;
    }

    return error.message;
  }

  static wrapHandler = (handler: Function, translations: Translations) => {
    return async (params: any) => {
      const command = params._[0];

      const context = new Context(params, translations);

      try {

        const start = Date.now();
        await handler(params, context);
        context.spinner.stop();

        const time = Date.now() - start;

        context.logger.info(`Command ${chalk.greenBright(command)} complete. Time estimate: ${chalk.greenBright(time.toString())} ms.`);

      } catch(ex) {
        context.spinner.stop();
        context.logger.error(CommandController.parseError(ex));
      }
    };
  }

  static enumerate(): any[] {
    return _.transform(fs.readdirSync(StaticConfig.commandsDir), (commands, file: string) => {
      const p = path.join(StaticConfig.commandsDir, file);
      if (fs.statSync(p).isDirectory()) {
        commands.push(this.instanceCommand(p));
      }
    }, []);
  }
}