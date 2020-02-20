import * as yargs from "yargs";
import * as _ from "lodash";
import chalk from "chalk";
import { DateTime } from "luxon";

import { Context } from "../../../common/context";
import { GraphqlActions } from "../../../consts/GraphqlActions";
import { translations } from "../../../common/translations";

export enum LogTagType {
  ERROR = "ERROR",
  INFO = "INFO",
  START = "START",
  END = "END",
  REPORT = "REPORT"
}

export const LOG_TAG_COLORS = {
  [LogTagType.ERROR]: chalk.red,
  [LogTagType.INFO]: chalk.cyan,
  [LogTagType.START]: chalk.dim,
  [LogTagType.END]: chalk.dim,
  [LogTagType.REPORT]: chalk.green
};

const printRequestId = (id: string) => chalk.grey(id);

const printTag = (tag: LogTagType) => {
  return LOG_TAG_COLORS[tag](`[${tag}]       `.slice(0, 8));
};

const beautifyLogLine = (line: string) => {
  line = line.replace(/\t/g, " ");

  line = line.replace(/\n$/, "");

  if (
    /^START RequestId: (\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\s*([\s\S]*)/.test(line)
  ) {
    line = line.replace(
      /^START RequestId: (\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\s*([\s\S]*)/,
      (substr: string, id: string, text: string) => {
        return (
          printRequestId(id) +
          ` ${printTag(LogTagType.START)} ` +
          chalk.dim(text)
        );
      }
    );
  }

  if (
    /^REPORT RequestId: (\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\s*([\s\S]*)/.test(line)
  ) {
    line = line.replace(
      /^REPORT RequestId: (\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\s*([\s\S]*)/,
      (substr: string, id: string, text: string) => {
        return (
          printRequestId(id) +
          ` ${printTag(LogTagType.REPORT)} ` +
          chalk.green(text)
        );
      }
    );

    line += "\n";
  }

  if (/^END RequestId: (\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\s*/.test(line)) {
    line = line.replace(
      /^END RequestId: (\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\s*/,
      (substr: string, id: string) => {
        return printRequestId(id) + ` ${printTag(LogTagType.END)}`;
      }
    );
  }

  if (
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) (\w{8}-\w{4}-\w{4}-\w{4}-\w{12}) ERROR Invoke Error\s*([\s\S]*)/.test(
      line
    )
  ) {
    line = line.replace(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) (\w{8}-\w{4}-\w{4}-\w{4}-\w{12}) ERROR Invoke Error\s*([\s\S]*)/,
      (substr: string, dt: string, id: string, text: string) => {
        try {
          text = JSON.stringify(JSON.parse(text), null, 2);
        } catch (e) {}

        return (
          printRequestId(id) +
          " " +
          printTag(LogTagType.ERROR) +
          chalk.red(` Datetime: ${DateTime.fromISO(dt).toFormat("F")}\n`) +
          text
        );
      }
    );
  }

  if (
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) (\w{8}-\w{4}-\w{4}-\w{4}-\w{12}) INFO\s*([\s\S]*)/.test(
      line
    )
  ) {
    line = line.replace(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) (\w{8}-\w{4}-\w{4}-\w{4}-\w{12}) INFO\s*([\s\S]*)/,
      (substr: string, dt: string, id: string, text: string) => {
        try {
          text = JSON.stringify(JSON.parse(text), null, 2);
        } catch (e) {}

        return (
          printRequestId(id) +
          " " +
          printTag(LogTagType.INFO) +
          chalk.cyan(` Datetime: ${DateTime.fromISO(dt).toFormat("F")} \n`) +
          text
        );
      }
    );
  }

  return line;
};

const printLogs = (logs: string[]) => {
  logs
    .map((line: string) => beautifyLogLine(line))
    .forEach((line: string) => {
      console.log(line);
    });
};

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
  return _.slice(messages, index + 1);
};

const readLogs = async (functionName: string, context: Context) => {
  let attempt = 0;
  let error = null;

  while (error === null) {
    const MS_PER_MINUTE = 60000;
    const minutes = 3;
    const start = new Date(Date.now() - minutes * MS_PER_MINUTE);

    if (attempt === 0) {
      context.spinner.start(translations.i18n.t("logs_tail_in_progress"));
    }

    let result;

    try {
      result = await context.request(GraphqlActions.logs, {
        functionName,
        startTime: start.toISOString()
      });
    } catch (e) {
      error = e;
    }

    context.spinner.stop();

    if (attempt === 0) {
      if (error) {
        context.logger.error(translations.i18n.t("logs_tail_failed"));
        continue;
      } else {
        context.logger.info(translations.i18n.t("logs_tail_success"));
      }
    }

    const logs = filterMessage(result.logs);

    if (logs.length > 0) {
      printLogs(logs);
    }

    if (attempt !== 0) {
      context.spinner.start(translations.i18n.t("logs_tail_wait"));
    }

    await sleep(1000);

    attempt = attempt + 1;
  }
};

export default {
  command: "logs [name]",
  handler: async (params: any, context: Context) => {
    if (params.n > 100) {
      params.n = 100;
    }

    if (params["t"]) {
      return await readLogs(params.name, context);
    }

    context.spinner.start(context.i18n.t("logs_in_progress"));

    const result = await context.request(GraphqlActions.logs, {
      functionName: params.name,
      limit: params.n
    });
    context.spinner.stop();

    printLogs(result.logs);
  },
  describe: translations.i18n.t("logs_describe"),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("logs_usage"))
      .positional("name", {
        describe: translations.i18n.t("logs_name_describe"),
        type: "string"
      })
      .demandOption("name")
      .option("num", {
        alias: "n",
        default: 10,
        describe: translations.i18n.t("logs_num_describe"),
        type: "number"
      })
      .option("tail", {
        alias: "t",
        describe: translations.i18n.t("logs_tail_describe"),
        type: "boolean"
      });
  }
};
