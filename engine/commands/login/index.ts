import * as _ from "lodash";
import { GraphqlActions } from "../../../common";
import { Context } from "../../../common/Context";
import { UserDataStorage } from "../../../common/userDataStorage";



export default {
  name: "login",
  handler: async (params: any, context: Context) => {
    const result = await context.request(GraphqlActions.login, { data: { email: params.u, password: params.p } });

    UserDataStorage.setValue("refreshToken", result.userLogin.auth.refreshToken);
    UserDataStorage.setValue("idToken", result.userLogin.auth.idToken);
    UserDataStorage.setValue("accounts", result.userLogin.accounts);

  }
};