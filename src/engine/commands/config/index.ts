import * as _ from "lodash";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import * as yargs from "yargs";
import { StorageParameters } from "../../../consts/StorageParameters";
import chalk from "chalk";
import { Colors } from "../../../consts/Colors";

export default {
  name: "config",
  handler: async (params: any, context: Context) => {

    if (params.v) {
      for(const key of Object.keys(StorageParameters)) {
        context.logger.info(`${key}: ${JSON.stringify(context.storage.getValue((<any>StorageParameters)[key]), null, 2)}\n`);
      }
      return;
    }

    if (params.s) {
      context.storage.setValues([
        {
          name: StorageParameters.serverAddress,
          value: params.s
        }
      ]);
      context.logger.info(`Set remote address ${chalk.hex(Colors.yellow)(params.s)}.`);
      return;
    }

    await context.chooseWorkspace(params.w);
  },

  describe: translations.i18n.t("config_describe"),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("config_usage"))
      .option("w", {
        alias: "workspace",
        describe: translations.i18n.t("config_workspace_option"),
        type: "string"
      })
      .option("s", {
        alias: "server",
        type: "string",
        hidden: true
      })
      .option("v", {
        alias: "view",
        type: "boolean",
        hidden: true
      });
  }
};