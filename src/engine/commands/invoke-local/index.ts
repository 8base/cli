import * as yargs from "yargs";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { Utils } from "../../../common/utils";
import { BuildController } from "../../controllers/buildController";
import chalk from "chalk";
import { Colors } from "../../../consts/Colors";
import * as fs from "fs";
import { InvokeLocalError } from "../../../errors/invokeLocal";

export default {
  command: "invoke-local",
  handler: async (params: any, context: Context) => {

    context.initializeProject();

    context.spinner.start(context.i18n.t("invokelocal_in_progress"));

    const { compiledFiles } = await BuildController.compile(context);

    const targetFunctionName = params._[1];
    const functionInfo = context.project.extensions.functions.find(r => r.name === targetFunctionName);
    if (!functionInfo) {
      throw new Error(`Function ${chalk.hex(Colors.yellow)(targetFunctionName)} not present.`);
    }

    const safeFunctionPath = functionInfo.pathToFunction.substring(0, functionInfo.pathToFunction.lastIndexOf("."));
    const funcPath = compiledFiles.find((f: any) => f.search(safeFunctionPath) > 0);
    context.logger.debug(`Function full path: ${funcPath}`);
    const { result, error } = Utils.safeExecution(() => require(funcPath));

    if (error) {
      throw new InvokeLocalError(error.message, functionInfo.name, funcPath);
    }

    const funcToCall = Utils.undefault(result);
    const args = params.j ? params.j : params.p ? fs.readFileSync(params.p) : null;
    context.spinner.stop();

    try {
      const funcResult = await funcToCall({ data: JSON.parse(args) });

      context.logger.info("\nResult:");
      context.logger.info(JSON.stringify(funcResult, null, 2));
    } catch (ex) {
      throw new InvokeLocalError(ex.message, functionInfo.name, funcPath);
    }
  },
  describe: translations.i18n.t("invokelocal_describe"),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("invokelocal_usage"))
      .demand(1)
      .option("j", {
        alias: "data-json",
        describe: "input JSON",
        type: "string"
      })
      .option("p", {
        alias: "data-path",
        describe: "path to input JSON",
        type: "string"
      });
  }
};
