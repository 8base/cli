import * as yargs from "yargs";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { GraphqlActions } from "../../../consts/GraphqlActions";
import * as url from "url";
import chalk from "chalk";
import _ = require("lodash");

const printResolvers = (resovlers: any[], context: Context) => {
  if (!_.isArray(resovlers)) {
    return;
  }

  resovlers.map(r => {
    let out = `Resolver: ${chalk.yellowBright("Name")}: ${r.name}`;
    out = _.padEnd(out, 50);
    out += `${chalk.yellowBright("Type")}: ${r.gqlType} `;
    context.logger.info(out);
  });

};

const printTriggers = (triggers: any[], context: Context) => {
  if (!_.isArray(triggers)) {
    return;
  }

  triggers.map(r => {
    let out = `Triggers: ${chalk.yellowBright("Table")}: ${r.table}`;
    out = _.padEnd(out, 50);
    out += `${chalk.yellowBright("Stages")}: ${r.stages} `;
    out = _.padEnd(out, 100);
    out += `${chalk.yellowBright("Action")}: ${r.action} `;
    context.logger.info(out);
  });
};

const printWebhooks = (webhooks: any[], context: Context) => {

};

const transformWebhook = (webhook: any, context: Context) => {
  return {
    ...webhook,
    httpMethod: webhook.httpMethod.toUpperCase() === "ANY" ? "POST" : webhook.httpMethod,
    fullPath: url.resolve(context.storage.user.getValue("remoteAddress"), this.accountRelativePath)
  };
};

export default {
  name: "describe",
  handler: async (params: any, context: Context) => {

    context.spinner.start(context.i18n.t("describe_progress"));
    const result = (await context.request(GraphqlActions.describe)).describeExtensions;
    context.spinner.stop();

    const webhooks = result.webhooks ? result.webhooks.map((w: any) => transformWebhook(w, context)) : [];
    printResolvers(result.resolvers, context);
    context.logger.info("");

    printTriggers(result.triggers, context);
    context.logger.info("");

    printWebhooks(result.webhooks, context);
  },
  describe: translations.i18n.t("describe_describe"),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args.usage(translations.i18n.t("describe_usage"));
  }
};
