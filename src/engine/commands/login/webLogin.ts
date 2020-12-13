import { Context } from '../../../common/context';
import { GraphqlActions } from '../../../consts/GraphqlActions';
import * as cuid from 'cuid';
const opn = require('opn');
import 'isomorphic-fetch';
import { SessionInfo } from '../../../interfaces/Common';
import { Utils } from '../../../common/utils';
import { DEFAULT_REMOTE_ADDRESS } from '../../../consts/Environment';

export const webLogin = async (params: any, context: Context): Promise<SessionInfo> => {
  context.spinner.start(context.i18n.t('login_in_progress'));
  const session = cuid();

  await opn(`${Utils.trimLastSlash(params.w)}/cli?guid=${session}`, { wait: false });

  const timeoutMs = 2000;
  let retryCount = 150; // 150 * 2s = 300s = 5 min

  let res = null;
  while (--retryCount > 0) {
    context.logger.debug(`try to fetch session ${session}`);
    const fetchResult = await fetch(
      `${Utils.trimLastSlash(context.serverAddress(DEFAULT_REMOTE_ADDRESS))}/loginSessionGet/${session}`,
    );

    if (fetchResult.status === 404) {
      context.logger.debug(`session not present`);
      await Utils.sleep(timeoutMs);
      continue;
    }
    if (fetchResult.status !== 200) {
      throw new Error(await fetchResult.text());
    }

    res = await fetchResult.json();
    retryCount = 0;
  }

  if (!res) {
    throw new Error(context.i18n.t('login_timeout_error'));
  }

  context.setSessionInfo(res);

  return {
    idToken: res.idToken,
    refreshToken: res.refreshToken,
  };
};
