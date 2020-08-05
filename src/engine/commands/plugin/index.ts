import * as path from 'path';
import * as yargs from 'yargs';
import { translations } from '../../../common/translations';
import { Utils } from '../../../common/utils';

export default {
  command: ['plugin <command>', 'p <command>'],
  describe: false && translations.i18n.t('plugin_describe'),
  builder: function(yargs: yargs.Argv) {
    return yargs.commandDir('commands', {
      extensions: ['js'],
      visit: Utils.commandDirMiddleware(path.join(__dirname, 'commands')),
    });
  },
  handler: function() {
    // This is parent handler. It is not used.
  },
};
