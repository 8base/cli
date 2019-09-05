import * as yargs from "yargs";
import * as _ from "lodash";
import * as fs from "fs";

import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { GraphqlActions } from "../../../consts/GraphqlActions";
import { ProjectController } from "../../controllers/projectController";

export default {
  command: "invoke <name>",
  handler: async (params: any, context: Context) => {
    context.initializeProject();

    context.spinner.start(context.i18n.t("invoke_in_progress"));

    let args = null;

    if (params.m) {
      args = ProjectController.getMock(context, params.name, params.m);
    } else if (params.p) {
      args = fs.readFileSync(params.p).toString();
    } else if (params.j) {
      args = params.j;
    }

    const result = await context.request(GraphqlActions.invoke, { data: { functionName: params.name, inputArgs: args } });

    context.spinner.stop();

    context.logger.info(result.invoke.responseData);
  },
  describe: translations.i18n.t("invoke_describe"),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("invoke_usage"))
      .option("data-json", {
        alias: "j",
        describe: translations.i18n.t("invoke_data_json_describe"),
        type: "string"
      })
      .option("data-path", {
        alias: "p",
        describe: translations.i18n.t("invoke_data_path_describe"),
        type: "string"
      })
      .option("mock", {
        alias: "m",
        describe: translations.i18n.t("invoke_mock_describe"),
        type: "string"
      });
  }
};
