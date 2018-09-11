import * as _ from "lodash";
import { Context } from "../../../common/Context";
import * as yargs from "yargs";
import { StorageParameters } from "../../../consts/StorageParameters";
import { trace, Utils } from "../../../common";

export default {
  name: "config",
  handler: async (params: any, context: Context) => {

    if (params.v) {
      for(const key of Object.keys(StorageParameters)) {
        trace(key + ": " + JSON.stringify(context.storage.user.getValue((<any>StorageParameters)[key]), null, 2));
        trace("");
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
      trace("set remote address = " + params.s);
      return;
    }

    await Utils.selectWorkspace(params, context);
  },

  describe: 'Advanced configuation',

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage("8base config [OPTIONS]")
      .option("w", {
        alias: 'workspace',
        describe: "workspace id",
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
      })
      .help()
      .version(false);
  }
};