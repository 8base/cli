import * as _ from 'lodash';
import { Context } from '../../../common/context';
import { translations } from '../../../common/translations';
import * as yargs from 'yargs';
import logout from '../logout';
import 'isomorphic-fetch';
import { StaticConfig } from '../../../config';
import { passwordLogin } from './passwordLogin';
import { Interactive } from '../../../common/interactive';
import { webLogin } from './webLogin';
import { StorageParameters } from '../../../consts/StorageParameters';
import * as jwtDecode from 'jwt-decode';

type LoginCommandParams = {
  email: string;
  password: string;
  token: string;
  w: string;
};

export default {
  command: 'login',
  handler: async (params: LoginCommandParams, context: Context) => {
    if (params.token) {
      context.setSessionInfo({ idToken: params.token });
      context.spinner.stop();

      return;
    }

    if (params.email && params.password) {
      const result = await passwordLogin(params, context);

      context.setSessionInfo(result);
      context.spinner.stop();

      return;
    }

    await logout.handler();

    const result = await webLogin(params, context);

    context.setSessionInfo(result);
    context.spinner.stop();
  },

  describe: translations.i18n.t('login_describe'),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t('login_usage'))
      .option('email', {
        alias: 'e',
        describe: translations.i18n.t('login_email_describe'),
        type: 'string',
      })
      .option('password', {
        alias: 'p',
        describe: translations.i18n.t('login_password_describe'),
        type: 'string',
      })
      .option('token', {
        alias: 't',
        describe: translations.i18n.t('login_token_describe'),
        type: 'string',
      })
      .option('w', {
        type: 'string',
        hidden: true,
      })
      .example(translations.i18n.t('login_browser_example_command'), translations.i18n.t('login_browser_example'))
      .example(translations.i18n.t('login_cli_example_command'), translations.i18n.t('login_cli_example'));
  },
};
