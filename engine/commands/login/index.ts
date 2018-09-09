import * as _ from "lodash";
import { GraphqlActions } from "../../../common";
import { Context } from "../../../common/Context";
import { UserDataStorage } from "../../../common/userDataStorage";
import * as yargs from "yargs";
import { waitForAnswer } from "../../../common/prompt";

export default {
  name: "login",
  handler: async (params: any, context: Context) => {

    let data = {
      email: params.e,
      password: params.p
    };

    const schema: any = {
      properties: {}
    };
    if (!params.e) {
      schema.properties["email"] = {
        message: "8base email",
      };
    }

    if (!params.e) {
      schema.properties["password"] = {
        hidden: true
      };
    }

    if (Object.keys(schema.properties).length > 0) {
      data = await waitForAnswer<{ email: string, password: string }>(schema);
    }

    const result = await context.request(GraphqlActions.login, { data: { email: data.email, password: data.password } });

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
        type: "string"
      })
      .option("password", {
        alias: 'p',
        describe: "user password",
        type: "string"
      })
      .help()
      .version(false);
  }
};


