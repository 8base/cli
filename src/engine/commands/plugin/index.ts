import * as path from 'path';
import * as yargs from 'yargs';
import { Utils } from '../../../common/utils';

export default {
  command: ['plugin <command>', 'p <command>'],
  describe: false,
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
