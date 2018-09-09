import * as _ from "lodash";
import { GraphqlActions } from "../../../common";
import { Context } from "../../../common/Context";
import { UserDataStorage } from "../../../common/userDataStorage";
import * as yargs from "yargs";


export default {
  name: "config",
  handler: async (params: any, context: Context) => {

    UserDataStorage.getValue("accounts");

  },
  describe: 'Advanced configuation',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage("8base config [OPTIONS]")
      .option("workspace", {
        alias: 'w',
        describe: "select workspace",
        type: "string"
      })
      .option("show", {
        alias: 's',
        describe: "show advanced configuration",
      })
      .help()
      .version(false);
  }
};