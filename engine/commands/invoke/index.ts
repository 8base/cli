import * as yargs from "yargs";
import { Context } from "../../../common/Context";
import _ = require("lodash");
import { InvalidArgument } from "../../../errors/invalidArgument";

export default {
  name: "invoke",
  handler: async (params: any, context: Context) => {

    console.log(params);
    // const functionName = params.f;

    // if (_.isNil(functionName)) {
    //   throw new InvalidArgument("function name");
    // }

    // this.args = params("data");
    // if (_.isNil(this.args)) {
    //   const p = config.getParameter("args_path");
    //   this.args = _.isNil(p) ? null : fs.readFileSync(p);
    // }

    // this.args = _.escape(JSON.stringify(JSON.parse(this.args)));
  },
  describe: 'Invoke function remotely',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
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
      })
      .usage("8base invoke")
      .help()
      .version(false);
  }
};
