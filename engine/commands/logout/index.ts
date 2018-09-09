import * as _ from "lodash";
import { GraphqlActions } from "../../../common";
import { Context } from "../../../common/Context";
import { UserDataStorage } from "../../../common/userDataStorage";
import * as yargs from "yargs";

export default {
  name: "logout",
  handler: async (params: any, context: Context) => {
    UserDataStorage.setValues([
      {
        name: "refreshToken",
        value: ""
      },
      {
        name: "idToken",
        value: ""
      },
      {
        name: "accounts",
        value: null
      }]);
  },
  describe: 'Clears local login credentials and invalidates API session',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage("8base logout")
      .help()
      .version(false);
  }
};