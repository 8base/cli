import yargs from 'yargs';
import * as _ from 'lodash';
import chalk from 'chalk';

import { Context } from '../../../common/context';
import { GraphqlActions } from '../../../consts/GraphqlActions';
import { translations } from '../../../common/translations';
import { Utils } from '../../../common/utils';

export enum LogTagType {
  ERROR = 'ERROR',
  INFO = 'INFO',
  START = 'START',
  END = 'END',
  REPORT = 'REPORT',
}

export const LOG_TAG_COLORS = {
  [LogTagType.ERROR]: chalk.red,
  [LogTagType.INFO]: chalk.cyan,
  [LogTagType.START]: chalk.dim,
  [LogTagType.END]: chalk.dim,
  [LogTagType.REPORT]: chalk.green,
};

const printRequestId = (id: string) => chalk.grey(id);

const printTag = (tag: LogTagType) => {
  return LOG_TAG_COLORS[tag](`[${tag}]       `.slice(0, 8));
};

const beautifyLogLine = (line: string) => {
  line = line.replace(/\t/g, ' ');

  line = line.replace(/\n$/, '');

  if (/^START RequestId: (\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\s*([\s\S]*)/.test(line)) {
    line = line.replace(
      /^START RequestId: (\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\s*([\s\S]*)/,
      (substr: string, id: string, text: string) => {
        return printRequestId(id) + ` ${printTag(LogTagType.START)} ` + chalk.dim(text);
      },
    );
  }

  if (/^REPORT RequestId: (\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\s*([\s\S]*)/.test(line)) {
    line = line.replace(
      /^REPORT RequestId: (\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\s*([\s\S]*)/,
      (substr: string, id: string, text: string) => {
        return printRequestId(id) + ` ${printTag(LogTagType.REPORT)} ` + chalk.green(text);
      },
    );

    line += '\n';
  }

  if (/^END RequestId: (\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\s*/.test(line)) {
    line = line.replace(/^END RequestId: (\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\s*/, (substr: string, id: string) => {
      return printRequestId(id) + ` ${printTag(LogTagType.END)}`;
    });
  }

  if (
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) (\w{8}-\w{4}-\w{4}-\w{4}-\w{12}) ERROR Invoke Error\s*([\s\S]*)/.test(
      line,
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
          ' ' +
          printTag(LogTagType.ERROR) +
          chalk.red(` Datetime: ${new Date(dt).toLocaleString()}\n`) +
          text
        );
      },
    );
  }

  if (/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) (\w{8}-\w{4}-\w{4}-\w{4}-\w{12}) INFO\s*([\s\S]*)/.test(line)) {
    line = line.replace(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) (\w{8}-\w{4}-\w{4}-\w{4}-\w{12}) INFO\s*([\s\S]*)/,
      (substr: string, dt: string, id: string, text: string) => {
        try {
          text = JSON.stringify(JSON.parse(text), null, 2);
        } catch (e) {}

        return (
          printRequestId(id) +
          ' ' +
          printTag(LogTagType.INFO) +
          chalk.cyan(` Datetime: ${new Date(dt).toLocaleString()} \n`) +
          text
        );
      },
    );
  }

  return line;
};

const printLogs = (logs: string[]) => {
  logs
    .map((line: string) => beautifyLogLine(line))
    .forEach((line: string) => {
      // eslint-disable-next-line no-console
      console.log(line);
    });
};

let lastMessage: string = '';

const filterMessage = (messages: string[]): string[] => {
  const index = messages.indexOf(lastMessage);

  if (index === -1) {
    lastMessage = messages.length > 0 ? _.last(messages) : '';
    return messages;
  }

  if (index + 1 === messages.length) {
    return [];
  }

  lastMessage = _.last(messages);
  return _.slice(messages, index + 1);
};

const readLogs = async (resource: string, context: Context) => {
  let attempt = 0;
  let error = null;

  while (error === null) {
    const MS_PER_MINUTE = 60000;
    const minutes = 3;
    const start = new Date(Date.now() - minutes * MS_PER_MINUTE);

    if (attempt === 0) {
      context.spinner.start(translations.i18n.t('logs_tail_in_progress'));
    }

    let result;

    try {
      result = await context.request(GraphqlActions.logs, {
        startTime: start.toISOString(),
        resource,
      });
    } catch (e) {
      error = e;
    }

    context.spinner.stop();

    if (attempt === 0) {
      if (error) {
        context.logger.error(translations.i18n.t('logs_tail_failed'));
        continue;
      } else {
        context.logger.info(translations.i18n.t('logs_tail_success'));
      }
    }

    const logs = filterMessage(result.system.logs.items);

    if (logs.length > 0) {
      printLogs(logs);
    }

    if (attempt !== 0) {
      context.spinner.start(translations.i18n.t('logs_tail_wait'));
    }

    await Utils.sleep(1000);

    attempt = attempt + 1;
  }
};

export default {
  command: 'logs [name]',
  handler: async (params: { name?: string; num: number; tail?: boolean; resource: string }, context: Context) => {
    if (params.name) {
      context.logger.warn(context.i18n.t('logs_name_deprecation'));
    }

    if (params.num > 100) {
      params.num = 100;
    }

    if (params.tail) {
      return readLogs(params.resource, context);
    }

    context.spinner.start(context.i18n.t('logs_in_progress'));

    const result = await context.request(GraphqlActions.logs, {
      limit: params.num,
      resource: params.resource,
    });
    context.spinner.stop();

    printLogs(result.system.logs.items);
  },
  describe: translations.i18n.t('logs_describe'),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t('logs_usage'))
      .positional('name', {
        describe: translations.i18n.t('logs_name_deprecation'),
        type: 'string',
      })
      .deprecateOption('name')
      .option('num', {
        alias: 'n',
        default: 10,
        describe: translations.i18n.t('logs_num_describe'),
        type: 'number',
        requiresArg: true,
        conflicts: 'tail',
      })
      .option('tail', {
        alias: 't',
        describe: translations.i18n.t('logs_tail_describe'),
        type: 'boolean',
        conflicts: 'num',
      })
      .option('resource', {
        alias: 'r',
        describe: translations.i18n.t('logs_resource_describe'),
        type: 'string',
        choices: ['environment:extensions', 'system:ci:commit'],
        default: 'environment:extensions',
        requiresArg: true,
      });
  },
};
