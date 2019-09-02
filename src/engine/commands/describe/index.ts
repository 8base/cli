import * as yargs from "yargs";
import * as url from "url";
import chalk from "chalk";
import { table } from "table";
import * as _ from "lodash";

import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { GraphqlActions } from "../../../consts/GraphqlActions";
import { Colors } from "../../../consts/Colors";

const RESOLVERS_HEADER = ["Name", "Description", "Type"];
const TRIGGERS_HEADER = ["Name", "Description", "Type", "Operation", "Table"];
const WEBHOOKS_HEADER = ["Name", "Description", "Method", "Path"];
const TASKS_HEADER = ["Name", "Description", "Schedule"];

export default {
  command: "describe",
  handler: async (params: any, context: Context) => {
    context.initializeProject();

    context.spinner.start(context.i18n.t("describe_progress"));

    let functionsList = (await context.request(GraphqlActions.functionsList)).functionsList;

    context.spinner.stop();

    functionsList = _.groupBy(functionsList.items, "functionType");

    context.logger.info(`${chalk.hex(Colors.yellow)("Resolvers:")}`);

    const resolvers = functionsList.resolver || [];
    const triggers = functionsList.trigger || [];
    const webhooks = functionsList.webhook || [];
    const tasks = functionsList.task || [];

    if (resolvers.length > 0) {
      context.logger.info(table([
        RESOLVERS_HEADER,
        ...resolvers.map((resolver: any) => [
          resolver.name,
          resolver.description,
          resolver.gqlType,
        ]),
      ]));
    } else {
      context.logger.info(translations.i18n.t("describe_empty_resolvers"));
      context.logger.info("");
    }

    context.logger.info(`${chalk.hex(Colors.yellow)("Triggers:")}`);

    if (triggers.length > 0) {
      context.logger.info(table([
        TRIGGERS_HEADER,
        ...triggers.map((trigger: any) => [
          trigger.name,
          trigger.description,
          trigger.type,
          trigger.operation,
          trigger.tableName,
        ]),
      ]));
    } else {
      context.logger.info(translations.i18n.t("describe_empty_triggers"));
      context.logger.info("");
    }

    context.logger.info(`${chalk.hex(Colors.yellow)("Webhooks:")}`);

    if (webhooks.length > 0) {
      context.logger.info(table([
        WEBHOOKS_HEADER,
        ...webhooks.map((webhook: any) => [
          webhook.name,
          webhook.description,
          webhook.httpMethod,
          url.resolve(context.serverAddress, webhook.workspaceRelativePath.toLowerCase()),
        ]),
      ]));
    } else {
      context.logger.info(translations.i18n.t("describe_empty_webhooks"));
      context.logger.info("");
    }

    context.logger.info(`${chalk.hex(Colors.yellow)("Tasks:")}`);

    if (tasks.length > 0) {
      context.logger.info(table([
        TASKS_HEADER,
        ...tasks.map((task: any) => [
          task.name,
          task.description,
          task.scheduleExpression,
        ]),
      ]));
    } else {
      context.logger.info(translations.i18n.t("describe_empty_tasks"));
      context.logger.info("");
    }
  },
  describe: translations.i18n.t("describe_describe"),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args.usage(translations.i18n.t("describe_usage"));
  }
};
