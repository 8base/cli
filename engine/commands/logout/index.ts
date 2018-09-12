import * as _ from "lodash";
import { Context, Translations } from "../../../common/Context";
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
  builder: (args: yargs.Argv, translations: Translations): yargs.Argv => {
    return args.usage(translations.i18n.t("logout_usage"));
  }
};