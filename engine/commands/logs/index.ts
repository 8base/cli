import * as yargs from "yargs";
import { Context } from "../../../common/Context";
import _ = require("lodash");
import { GraphqlActions } from "../../../consts/GraphqlActions";


export default {
  name: "logs",
  handler: async (params: any, context: Context) => {

    const result = await context.request(GraphqlActions.logs, { functionName: params.f, limit: params.n });

    // context.logger.info(JSON.stringify(JSON.parse(_.unescape(result.invoke.responseData)).data, null, 2));
    context.logger.info(result.logs);
  },
  describe: 'Invoke function remotely',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage("8base invoke [OPTIONS]")
      .option("f", {
        alias: 'function',
        require: true,
        type: "string",
        describe: "function to invoke"
      })
      .option("n", {
        alias: 'num',
        default: 10,
        describe: "number of lines to display (default: 10, max: 100)",
        type: "number",
        coerce: arg => arg > 100 ? 100 : arg
      });
  }
};
