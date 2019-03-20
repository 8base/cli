import * as yargs from "yargs";
import { Context } from "../../../common/context";
import _ = require("lodash");
import { GraphqlActions } from "../../../consts/GraphqlActions";
import { translations } from "../../../common/translations";

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

let lastMessage: string = "";

const filterMessage = (messages: string[]): string[] => {
  const index = messages.indexOf(lastMessage);

  if (index === -1) {
    lastMessage = messages.length > 0 ? _.last(messages) : "";
    return messages;
  }

  if (index + 1 === messages.length) {
    return [];
  }

  lastMessage = _.last(messages);
  return _.slice(messages, index);
};

const readLogs = async (functionName: string, context: Context) => {

  while(true) {
    const MS_PER_MINUTE = 60000;
    const minutes = 3;
    const start = new Date(Date.now() - minutes * MS_PER_MINUTE);

    const result = await context.request(GraphqlActions.logs, { functionName, startTime: start.toISOString() });
    const logs = filterMessage(result.logs);
    if (logs.length > 0) {
      context.logger.info(logs);
    }

    await sleep(1000);
  }
};

export default {
  command: "logs",
  handler: async (params: any, context: Context) => {
    if (params["t"] ) {
      return await readLogs(params._[1], context);
    }

    context.spinner.start(context.i18n.t("logs_in_progress"));

    const result = await context.request(GraphqlActions.logs, { functionName: params._[1], limit: params.n });
    context.spinner.stop();
    context.logger.info(result.logs);
  },
  describe: translations.i18n.t("logs_describe"),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("logs_usage"))
      .demand(1)
      .option("n", {
        alias: "num",
        default: 10,
        describe: "number of lines to display (default: 10, max: 100)",
        type: "number",
        coerce: arg => arg > 100 ? 100 : arg
      })
      .option("t", {
        alias: "tail",
        describe: "continually stream logs",
        type: "boolean"
      });
  }
};
