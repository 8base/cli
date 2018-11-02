import * as _ from "lodash";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import * as yargs from "yargs";
import logout from "../logout";
import 'isomorphic-fetch';
import { StaticConfig } from "../../../config";
import { passwordLogin } from "./passwordLogin";
import { webLogin } from "./webLogin";


export default {
  name: "login",
  handler: async (params: any, context: Context) => {

    const result = params.e || params.p ? await passwordLogin(params, context) : await webLogin(params, context);

    await logout.handler(params, context);
    context.setSessionInfo(result);
    context.spinner.stop();
    await context.chooseWorkspace();
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
      })
      .option("w", {
        type: "string",
        default: StaticConfig.webClientAddress,
        hidden: true
      });
  }
};
