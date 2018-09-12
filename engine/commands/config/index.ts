import * as _ from "lodash";
import { Context, Translations } from "../../../common/Context";
import * as yargs from "yargs";
import { StorageParameters } from "../../../consts/StorageParameters";
import { Utils } from "../../../common";

export default {
  name: "config",
  handler: async (params: any, context: Context) => {

    if (params.v) {
      for(const key of Object.keys(StorageParameters)) {
        context.logger.info(`${key}: ${JSON.stringify(context.storage.user.getValue((<any>StorageParameters)[key]), null, 2)}\n`);
      }
      return;
    }
    if (params.s) {
      context.storage.user.setValues([
        {
          name: StorageParameters.serverAddress,
          value: params.s
        }
      ]);
      context.logger.info(context.i18n.t("set_remote_address", { address: params.s }));
      return;
    }

    await Utils.selectWorkspace(params, context);
  },

  describe: 'Advanced configuation',

  builder: (args: yargs.Argv, translations: Translations): yargs.Argv => {
    return args
      .usage(translations.i18n.t("config_usage"))
      .option("w", {
        alias: 'workspace',
        describe: translations.i18n.t("config_workspace_option"),
        type: "string"
      })
      .option("s", {
        alias: 'server',
        type: "string",
        hidden: true
      })
      .option("v", {
        alias: 'view',
        type: "boolean",
        hidden: true
      });
  }
};