import * as yargs from "yargs";
import * as fs from "fs";
import chalk from "chalk";
import * as dotenv from "dotenv";
import * as path from "path";

import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { Utils } from "../../../common/utils";
import { BuildController } from "../../controllers/buildController";
import { Colors } from "../../../consts/Colors";
import { InvokeLocalError } from "../../../errors/invokeLocal";
import { ProjectController } from "../../controllers/projectController";

export default {
  command: "invoke-local [name]",
  handler: async (params: any, context: Context) => {
    context.initializeProject();

    dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

    context.spinner.start(context.i18n.t("invokelocal_in_progress"));

    const { compiledFiles } = await BuildController.compile(context);

    const targetFunctionName = params.name;
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

    let args = null;

    if (params.m) {
      args = ProjectController.getMock(context, params.name, params.m);
    } else if (params.p) {
      args = fs.readFileSync(params.p);
    } else if (params.j) {
      args = params.j;
    }

    context.spinner.stop();

    try {
      const funcResult = await funcToCall(JSON.parse(args), {
        api: {
          gqlRequest: context.request.bind(context),
        },
        workspaceId: context.workspaceId,
      });

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
      .positional("name", {
        describe: translations.i18n.t("invokelocal_name_describe"),
        type: "string",
      })
      .demandOption("name")
      .option("data-json", {
        alias: "j",
        describe: translations.i18n.t("invokelocal_data_json_describe"),
        type: "string"
      })
      .option("data-path", {
        alias: "p",
        describe: translations.i18n.t("invokelocal_data_path_describe"),
        type: "string"
      })
      .option("mock", {
        alias: "m",
        describe: translations.i18n.t("invokelocal_mock_describe"),
        type: "string"
      });
  }
};
