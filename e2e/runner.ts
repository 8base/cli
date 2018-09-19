import * as execa from 'execa';
import * as path from 'path';
import * as pkg from '../package.json';

const CLI_BIN = require.resolve(`../${pkg.bin['8base']}`);

const runner = (cwd?: any, env?: any) => {
  const opts = {
    cwd,
    env: Object.assign({
      HOME: process.env.HOME,
    }, env),
   };

   return (...args: any[]) => execa('node', [CLI_BIN].concat(args), opts);
};

export { runner };