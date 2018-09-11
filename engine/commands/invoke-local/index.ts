import * as yargs from "yargs";
import { Context } from "../../../common/Context";
import _ = require("lodash");
import { InvalidArgument } from "../../../errors/invalidArgument";

export default {
  name: "invoke-local",
  handler: async (params: any, context: Context) => {
    throw new Error("not implemented");
  },
  describe: 'Invoke function locally',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage("8base invoke-local [OPTIONS]")
      .option("n", {
        alias: 'name',
        describe: "function name"
      })
      .option("i", {
        alias: 'input',
        describe: "function input data",
        type: "string"
      })
      .option("p", {
        alias: 'path',
        describe: "path to file with function input data",
        type: "string"
      });
  }
};
