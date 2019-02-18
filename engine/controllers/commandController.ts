import { Utils } from "../../common/utils";
import { StaticConfig } from "../../config";
import * as path from "path";
import * as _ from "lodash";
import * as fs from "fs";
import { Translations } from "../../common/translations";
import { Context } from "../../common/context";
import chalk from "chalk";
import { Colors } from "../../consts/Colors";


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
    if (error.response && error.response.errors && error.response.errors.length > 0 && error.response.errors[0].message) {
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

      const start = Date.now();
      try {

        await handler(params, context);
        context.spinner.stop();

        const time = Date.now() - start;

        context.logger.info(`${chalk.hex(Colors.green)(command)} done. Time: ${chalk.hex(Colors.green)(time.toLocaleString('en-US'))} ms.`);

      } catch(ex) {
        context.spinner.stop();
        const time = Date.now() - start;
        context.logger.error(`${CommandController.parseError(ex)} \n Time: ${chalk.hex(Colors.red)(time.toLocaleString('en-US'))} ms.`
        );

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