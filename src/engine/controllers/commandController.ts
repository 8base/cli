import { Translations } from "../../common/translations";
import { Context } from "../../common/context";
import chalk from "chalk";
import { Colors } from "../../consts/Colors";


export class CommandController {
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

        context.logger.info(`${chalk.hex(Colors.green)(command)} done. Time: ${chalk.hex(Colors.green)(time.toLocaleString("en-US"))} ms.`);

      } catch(ex) {
        context.spinner.stop();
        const time = Date.now() - start;
        context.logger.error(`${CommandController.parseError(ex)} \n Time: ${chalk.hex(Colors.red)(time.toLocaleString("en-US"))} ms.`
        );

      }
    };
  }
}