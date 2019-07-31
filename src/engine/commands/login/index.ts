import * as _ from "lodash";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import * as yargs from "yargs";
import logout from "../logout";
import "isomorphic-fetch";
import { StaticConfig } from "../../../config";
import { passwordLogin } from "./passwordLogin";
import { webLogin } from "./webLogin";
import { StorageParameters } from "../../../consts/StorageParameters";

type LoginCommandParams = {
  email: string,
  password: string,
  w: string,
  workspace: string,
};

export default {
  command: "login",
  handler: async (params: LoginCommandParams, context: Context) => {
    await logout.handler();

    const result = params.email || params.password ? await passwordLogin(params, context) : await webLogin(params, context);
    context.setSessionInfo(result);
    context.spinner.stop();

    await context.chooseWorkspace(params.workspace);
  },

  describe: translations.i18n.t("login_describe"),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("login_usage"))
      .option("email", {
        alias: "e",
        describe: "user email",
        type: "string"
      })
      .option("password", {
        alias: "p",
        describe: "user password",
        type: "string"
      })
      .option("w", {
        type: "string",
        default: StaticConfig.webClientAddress,
        hidden: true
      })
      .option("workspace", {
        type: "string",
        hidden: true
      })
      .example(translations.i18n.t("login_browser_example_command"), translations.i18n.t("login_browser_example"))
      .example(translations.i18n.t("login_cli_example_command"), translations.i18n.t("login_cli_example"));
  }
};
