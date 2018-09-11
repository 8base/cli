import * as _ from "lodash";
import { Context } from "../../../common/Context";
import { UserDataStorage } from "../../../common/userDataStorage";
import * as yargs from "yargs";
import { StorageParameters } from "../../../consts/StorageParameters";

export default {
  name: "logout",
  handler: async (params: any, context: Context) => {
    UserDataStorage.setValues([
      {
        name: StorageParameters.refreshToken,
        value: ""
      },
      {
        name: StorageParameters.idToken,
        value: ""
      },
      {
        name: StorageParameters.activeWorkspace,
        value: null
      },
      {
        name: StorageParameters.workspaces,
        value: null
      }
    ]);
  },
  describe: 'Clears local login credentials and invalidates API session',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args.usage("8base logout [OPTIONS]");
  }
};