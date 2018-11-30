import * as yargs from "yargs";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { GraphqlActions } from "../../../consts/GraphqlActions";
import * as url from "url";
import chalk from "chalk";
import _ = require("lodash");

const tabSize = 30;

const printResolvers = (resolvers: any[], context: Context) => {
  if (!_.isArray(resolvers)) {
    return;
  }

  context.logger.info(`${chalk.yellowBright("Resolvers:")}`);

  resolvers.map(r => {
    let out = `   ${r.name}`;
    out = _.padEnd(out, tabSize);
    out += `${chalk.yellowBright("type")}: ${r.gqlType} `;
    context.logger.info(out);
  });

};

const printTriggers = (triggers: any[], context: Context) => {
  if (!_.isArray(triggers)) {
    return;
  }

  context.logger.info(`${chalk.yellowBright("Triggers:")}`);
  triggers.map(r => {
    let out = `   ${r.name}`;
    out = _.padEnd(out, tabSize);
    out += `${chalk.yellowBright("type")}: ${r.type} `;

    out = _.padEnd(out, tabSize * 2);
    out += `${chalk.yellowBright("table")}: ${r.tableName}`;

    out = _.padEnd(out, tabSize * 3);
    out += `${chalk.yellowBright("operation")}: ${r.operation} `;

    context.logger.info(out);
  });
};

const printWebhooks = (webhooks: any[], context: Context) => {
  if (!_.isArray(webhooks)) {
    return;
  }

  context.logger.info(`${chalk.yellowBright("Webhooks:")}`);
  webhooks.map(r => {
    let out = `   ${r.name}`;

    out = _.padEnd(out, tabSize);

    out += `${chalk.yellowBright("method")}: ${r.httpMethod} `;
    out = _.padEnd(out, tabSize * 2);

    out += `${chalk.yellowBright("path")}: ${r.fullPath} `;
    context.logger.info(out);
  });
};

const transformWebhook = (webhook: any, context: Context) => {
  return {
    ...webhook,
    httpMethod: webhook.httpMethod.toUpperCase(),
    fullPath: url.resolve(context.serverAddress, webhook.workspaceRelativePath)
  };
};

export default {
  name: "describe",
  handler: async (params: any, context: Context) => {

    context.project;

    context.spinner.start(context.i18n.t("describe_progress"));
    const result = (await context.request(GraphqlActions.describe)).describeExtensions;
    context.spinner.stop();

    printResolvers(result.resolvers, context);
    context.logger.info("");

    printTriggers(result.triggers, context);
    context.logger.info("");

    const webhooks = result.webhooks ? result.webhooks.map((w: any) => transformWebhook(w, context)) : [];
    printWebhooks(webhooks, context);
  },
  describe: translations.i18n.t("describe_describe"),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args.usage(translations.i18n.t("describe_usage"));
  }
};
