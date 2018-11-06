import * as _ from "lodash";
import { Context } from "../../../common/context";
import { GraphqlActions } from "../../../consts/GraphqlActions";
import { StorageParameters } from "../../../consts/StorageParameters";
import * as cuid from "cuid";
const opn = require("opn");
import 'isomorphic-fetch';
import { SessionInfo } from "../../../interfaces/Common";
import { Utils } from "../../../common/utils";


export const webLogin = async (params: any, context: Context): Promise<SessionInfo> => {
  context.spinner.start(context.i18n.t("login_in_progress"));
  const session = cuid();

  await opn(`${Utils.trimLastSlash(params.w)}/cli?guid=${session}`, { wait: false });

  const server = context.storage.getValue(StorageParameters.serverAddress) || context.config.remoteAddress;

  let retryCount = 20;
  let res = null;
  while(--retryCount > 0) {
    context.logger.debug(`try to fetch session ${session}`);
    const fetchResult = await fetch(`${server}/loginSessionGet/${session}`);

    if (fetchResult.status === 404) {
      context.logger.debug(`session not present`);
      await Utils.sleep(2000);
      continue;
    }
    if (fetchResult.status !== 200) {
      throw new Error(await fetchResult.text());
    }

    res = await fetchResult.json();
    retryCount = 0;
  }

  if (!res) {
    throw new Error(context.i18n.t("login_timeout_error"));
  }

  context.setSessionInfo(res);

  const workspaces = await context.request(GraphqlActions.listWorkspaces, null, false);

  return {
    idToken: res.idToken,
    refreshToken: res.refreshToken,
    workspaces: workspaces.workspacesList.items
  };
};