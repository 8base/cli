import { Context } from '../../../common/context';
import * as cuid from '@paralleldrive/cuid2';
import open from 'open';
import 'isomorphic-fetch';
import { SessionInfo } from '../../../interfaces/Common';
import { Utils } from '../../../common/utils';
import dotenv from 'dotenv';

export const webLogin = async (params: { w: string }, context: Context): Promise<SessionInfo> => {
  dotenv.config();
  context.spinner.start(context.i18n.t('login_in_progress'));
  const session = cuid.createId();

  await open(`${Utils.trimLastSlash(params.w)}/cli?guid=${session}`, { wait: false });

  const timeoutMs = 2000;
  let retryCount = 200; // 150 * 2s = 300s = 5 min

  let res: any = null;
  while (--retryCount > 0) {
    context.logger.debug(`try to fetch session ${session}`);
    try {
      const response = await Utils.checkHttpResponse(
        fetch(`${Utils.trimLastSlash(context.resolveMainServerAddress())}/loginSessionGet/${session}`) as any,
      );
      res = await response.json();
      context.logger.debug(`session result: ${JSON.stringify(res)}`);
    } catch (e) {
      if (e.statusCode === 404) {
        context.logger.debug(`session not present`);
        await Utils.sleep(timeoutMs);
        continue;
      }
    }

    retryCount = 0;
  }

  context.logger.debug(`session result: ${JSON.stringify(res)}`);
  if (!res) {
    throw new Error(context.i18n.t('login_timeout_error'));
  }

  context.setSessionInfo(res);

  return {
    idToken: res.idToken,
    refreshToken: res.refreshToken,
  };
};
