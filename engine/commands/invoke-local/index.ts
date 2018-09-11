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
      .option("f", {
        alias: 'function',
        require: true,
        type: "string",
        describe: "function to invoke"
      })
      .option("j", {
        alias: 'data-json',
        describe: "input JSON",
        type: "string"
      })
      .option("p", {
        alias: 'data-path',
        describe: "path to input JSON",
        type: "string"
      });
  }
};
