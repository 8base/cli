import * as _ from "lodash";
import { trace } from "../../../common";
import { Context } from "../../../common/Context";
import { UserDataStorage } from "../../../common/userDataStorage";
import * as yargs from "yargs";
import { Interactive } from "../../../common/interactive";
import { GraphqlActions } from "../../../consts/GraphqlActions";
import { StorageParameters } from "../../../consts/StorageParameters";
import logout from "../logout";

const promptEmail = async (): Promise<string> => {
  return (await Interactive.ask({ type: "text", name: "email", message: "Email" })).email;
};

const promptPassword = async (): Promise<string> => {
  return (await Interactive.ask(
    {
      name: "password",
      message: "Password",
      type: "password"
    }
  )).password;
};

export default {
  name: "login",
  handler: async (params: any, context: Context) => {

    const data = {
      email: params.e ? params.e : await promptEmail(),
      password: params.p ? params.p : await promptPassword()
    };

    await logout.handler(params, context);

    const result = await context.request(GraphqlActions.login, { data: { email: data.email, password: data.password } });

    UserDataStorage.setValues([
      {
        name: StorageParameters.refreshToken,
        value: result.userLogin.auth.refreshToken
      },
      {
        name: StorageParameters.idToken,
        value: result.userLogin.auth.idToken
      },
      {
        name: StorageParameters.workspaces,
        value: result.userLogin.accounts
      }]);

    trace("Login success");
  },

  describe: 'Login with your 8base credentials',

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage("8base login [OPTIONS]")
      .option("e", {
        alias: 'email',
        describe: "user email",
        type: "string"
      })
      .option("p", {
        alias: 'password',
        describe: "user password",
        type: "string"
      })
      .help()
      .version(false);
  }
};
