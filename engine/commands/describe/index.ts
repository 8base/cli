import * as yargs from "yargs";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { GraphqlActions } from "../../../consts/GraphqlActions";
import * as url from "url";
import chalk from "chalk";
import _ = require("lodash");

const tabSize = 35;

const printResolvers = (resovlers: any[], context: Context) => {
  if (!_.isArray(resovlers)) {
    return;
  }

  resovlers.map(r => {
    let out = `${chalk.yellowBright("Extension:")} resolver `;
    out = _.padEnd(out, tabSize);
    out += `${chalk.yellowBright("Name")}: ${r.name}`;

    out = _.padEnd(out, tabSize * 2);
    out += `${chalk.yellowBright("Type")}: ${r.gqlType} `;
    context.logger.info(out);
  });

};

const printTriggers = (triggers: any[], context: Context) => {
  if (!_.isArray(triggers)) {
    return;
  }

  triggers.map(r => {
    let out = `${chalk.yellowBright("Extension:")} trigger `;
    out = _.padEnd(out, tabSize);

    out += `${chalk.yellowBright("Name")}: ${r.name}`;
    out = _.padEnd(out, tabSize * 2);

    out += `${chalk.yellowBright("Table")}: ${r.table}`;
    out = _.padEnd(out, tabSize * 3);

    out += `${chalk.yellowBright("Stages")}: ${r.stages} `;
    out = _.padEnd(out, tabSize * 4);

    out += `${chalk.yellowBright("Type")}: ${r.type} `;
    context.logger.info(out);
  });
};

const printWebhooks = (webhooks: any[], context: Context) => {
  if (!_.isArray(webhooks)) {
    return;
  }

  webhooks.map(r => {
    let out = `${chalk.yellowBright("Extension:")} webhook `;
    out = _.padEnd(out, tabSize);

    out += `${chalk.yellowBright("Name")}: ${r.name}`;
    out = _.padEnd(out, tabSize * 2);

    out += `${chalk.yellowBright("Method")}: ${r.httpMethod} `;
    out = _.padEnd(out, tabSize * 3);

    out += `${chalk.yellowBright("Path")}: ${r.fullPath} `;
    context.logger.info(out);
  });
};

const transformWebhook = (webhook: any, context: Context) => {
  return {
    ...webhook,
    httpMethod: webhook.httpMethod.toUpperCase(),
    fullPath: url.resolve(context.serverAddress, webhook.accountRelativePath)
  };
};

export default {
  name: "describe",
  handler: async (params: any, context: Context) => {

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
