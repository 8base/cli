import * as path from 'node:path';
import yargs from 'yargs';

import { translations } from '../../../common/translations';
import { Utils } from '../../../common/utils';

export default {
  command: ['environment <command>'],
  describe: translations.i18n.t('environment_describe'),
  builder: function (yargs: yargs.Argv) {
    return yargs.commandDir('commands', {
      extensions: ['js'],
      visit: Utils.commandDirMiddleware(path.join(__dirname, 'commands')),
    });
  },
  handler: function () {
    // This is parent handler. It is not used.
  },
};
