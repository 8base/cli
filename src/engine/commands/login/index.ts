import * as _ from "lodash";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import * as yargs from "yargs";
import logout from "../logout";
import "isomorphic-fetch";
import { StaticConfig } from "../../../config";
import { passwordLogin } from "./passwordLogin";
import { webLogin } from "./webLogin";


export default {
  command: "login",
  handler: async (params: any, context: Context) => {
    await logout.handler();

    const result = params.e || params.p ? await passwordLogin(params, context) : await webLogin(params, context);
    context.setSessionInfo(result);
    context.spinner.stop();
    await context.chooseWorkspace();
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
      });
  }
};
