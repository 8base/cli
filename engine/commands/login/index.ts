import * as _ from "lodash";
import { GraphqlActions } from "../../../common";
import { Context } from "../../../common/Context";
import { UserDataStorage } from "../../../common/userDataStorage";
import * as yargs from "yargs";

export default {
  name: "login",
  handler: async (params: any, context: Context) => {
    const result = await context.request(GraphqlActions.login, { data: { email: params.u, password: params.p } });

    UserDataStorage.setValues([
      {
        name: "refreshToken",
        value: result.userLogin.auth.refreshToken
      },
      {
        name: "idToken",
        value: result.userLogin.auth.idToken
      },
      {
        name: "accounts",
        value: result.userLogin.accounts
      }]);
  },
  describe: 'Login with your 8base credentials',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage("8base login [OPTIONS]")
      .option("email", {
        alias: 'e',
        describe: "user email",
        demand: true,
        type: "string"
      })
      .option("password", {
        alias: 'p',
        describe: "user password",
        demand: true,
        type: "string"
      })
      .help()
      .version(false);
  }
};


