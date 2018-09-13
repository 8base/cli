import * as _ from "lodash";
import { Utils } from "../../../common";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { UserDataStorage } from "../../../common/userDataStorage";
import * as yargs from "yargs";
import { Interactive } from "../../../common/interactive";
import { GraphqlActions } from "../../../consts/GraphqlActions";
import { StorageParameters } from "../../../consts/StorageParameters";
import logout from "../logout";

const promptEmail = async (): Promise<string> => {
  return (await Interactive.ask({ type: "text", name: "email", message: "Email:" })).email;
};

const promptPassword = async (): Promise<string> => {
  return (await Interactive.ask(
    {
      name: "password",
      message: "Password:",
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

    context.spinner.start(context.i18n.t("login_in_progress"));
    await logout.handler(params, context);

    const result = await context.request(GraphqlActions.login, { data: { email: data.email, password: data.password } }, false);

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
      },
      {
        name: StorageParameters.email,
        value: data.email
      }
    ]);

    context.spinner.stop();

    if (result.userLogin.accounts.length > 1) {
      Utils.selectWorkspace(null, context);
    } else if (result.userLogin.accounts.length === 1) {
      Utils.selectWorkspace({ w: result.userLogin.accounts[0].account }, context);
    } else {
      throw new Error("Internal error");
    }
  },

  describe: translations.i18n.t("login_describe"),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("login_usage"))
      .option("e", {
        alias: 'email',
        describe: "user email",
        type: "string"
      })
      .option("p", {
        alias: 'password',
        describe: "user password",
        type: "string"
      });
  }
};
