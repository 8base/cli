import yargs from 'yargs';
import jwtDecode from 'jwt-decode';
import chalk from 'chalk';

import { Context } from '../../../common/context';
import { translations } from '../../../common/translations';
import { StorageParameters } from '../../../consts/StorageParameters';

export default {
  command: 'whoami',

  handler: async (params: {}, context: Context) => {
    if (!context.user.isAuthorized()) {
      throw new Error(context.i18n.t('logout_error'));
    }

    let email, name;

    try {
      const idToken = context.storage.getValue(StorageParameters.idToken);

      ({ email, name } = jwtDecode<{ email: string; name: string }>(idToken));
    } catch (e) {}

    if (!email && context.isProjectDir()) {
      try {
        const { user } = await context.request('{ user { email firstName lastName }}');

        email = user.email;

        name = `${user.firstName} ${user.lastName}`;
      } catch (e) {}
    }

    context.logger.info(translations.i18n.t('who_am_i_text', { email: chalk.green(email), name }));
  },

  describe: translations.i18n.t('who_am_i_describe'),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args.usage(translations.i18n.t('who_am_i_usage'));
  },
};
