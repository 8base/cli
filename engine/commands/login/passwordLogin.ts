import * as _ from "lodash";
import { Context } from "../../../common/context";
import { GraphqlActions } from "../../../consts/GraphqlActions";
import { Interactive } from "../../../common/interactive";
import { SessionInfo } from "../../../interfaces/Common";

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


export const passwordLogin = async (params: any, context: Context): Promise<SessionInfo> => {
  context.logger.info(context.i18n.t("login_password_warning"));

  const data = {
    email: params.e ? params.e : await promptEmail(),
    password: params.p ? params.p : await promptPassword()
  };

  context.spinner.start(context.i18n.t("login_in_progress"));
  const result = await context.request(GraphqlActions.login, { data: { email: data.email, password: data.password } }, false);
  return {
    idToken: result.userLogin.auth.idToken,
    refreshToken: result.userLogin.auth.refreshToken,
    workspaces: result.userLogin.workspaces.map((w: any) => { return { name: w.name, id: w.workspace };})
  };
};