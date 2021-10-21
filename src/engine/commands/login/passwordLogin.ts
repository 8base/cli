import { Context } from '../../../common/context';
import { GraphqlActions } from '../../../consts/GraphqlActions';
import { Interactive } from '../../../common/interactive';
import { SessionInfo } from '../../../interfaces/Common';
import { REQUEST_HEADER_IGNORED } from '../../../consts/request';

const promptEmail = async (): Promise<string> => {
  return (await Interactive.ask({ type: 'text', name: 'email', message: 'Email:' })).email;
};

const promptPassword = async (): Promise<string> => {
  return (
    await Interactive.ask({
      name: 'password',
      message: 'Password:',
      type: 'password',
    })
  ).password;
};

export const passwordLogin = async (params: any, context: Context): Promise<SessionInfo> => {
  context.logger.info(context.i18n.t('login_password_warning'));

  const data = {
    email: params.email ? params.email : await promptEmail(),
    password: params.password ? params.password : await promptPassword(),
  };

  context.spinner.start(context.i18n.t('login_in_progress'));

  const result = await context.request(
    GraphqlActions.login,
    { data: { email: data.email, password: data.password } },
    {
      customAuthorization: REQUEST_HEADER_IGNORED,
      address: context.resolveMainServerAddress(),
      customWorkspaceId: REQUEST_HEADER_IGNORED,
    },
  );

  return {
    idToken: result.userLogin.auth.idToken,
    refreshToken: result.userLogin.auth.refreshToken,
  };
};
