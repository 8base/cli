import * as _ from "lodash";
import { GraphqlActions } from "../../../common";
import { Context } from "../../../common/Context";
import { UserDataStorage } from "../../../common/userDataStorage";
import * as yargs from "yargs";


export default {
  name: "config",
  handler: async (params: any, context: Context) => {
    // const result = await context.request(GraphqlActions.login, { data: { email: params.u, password: params.p } });

    UserDataStorage.getValue("accounts");
    // UserDataStorage.setValue("idToken", result.userLogin.auth.idToken);
    // UserDataStorage.setValue("accounts", result.userLogin.accounts);

  },
  describe: 'Advanced configuation',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage("8base config [OPTIONS]")
      .option("workspace", {
        alias: 'w',
        describe: "select workspace",
        demand: true,
        type: "string"
      })
      .help()
      .version(false);
  }
};