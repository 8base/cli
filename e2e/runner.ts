import * as execa from "execa";
import { CLI_BIN } from "./consts";

const runner = (cwd?: any, env?: any) => {
  const opts = {
    cwd,
    env: Object.assign({
      HOME: process.env.HOME,
    }, env),
  };

  return (...args: any[]) => execa("node", [CLI_BIN].concat(args), opts);
};

export { runner };
