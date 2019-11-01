import * as yargs from "yargs";
import * as _ from "lodash";

import { Utils } from "../../../common/utils";
import { GraphqlController } from "../../controllers/graphqlController";
import { BuildController } from "../../controllers/buildController";
import { Context } from "../../../common/context";
import { GraphqlActions } from "../../../consts/GraphqlActions";
import { translations } from "../../../common/translations";
import { DeployStatus } from "../../../consts/DeployStatus";
import { DeployModeType } from "../../../interfaces/Extensions";

export default {
  command: "deploy",
  handler: async (params: any, context: Context) => {
    context.spinner.start(context.i18n.t("deploy_in_progress", { status: "prepare to upload" }));

    context.initializeProject();

    if (params["validate_schema"]) {
      GraphqlController.validateSchema(context.project);
    }

    const buildDir = await BuildController.package(context);
    context.logger.debug(`build dir: ${buildDir}`);

    const { prepareDeploy } = await context.request(GraphqlActions.prepareDeploy);

    await Utils.upload(prepareDeploy.uploadMetaDataUrl, buildDir.meta, context);
    context.logger.debug("upload meta data complete");

    await Utils.upload(prepareDeploy.uploadBuildUrl, buildDir.build, context);
    context.logger.debug("upload source code complete");

    let deployOptions = { mode: params.mode };

    if (Array.isArray(params.plugins) && params.plugins.length > 0) {
      deployOptions = _.set(deployOptions, "pluginNames", params.plugins);
    }

    await context.request(GraphqlActions.deploy, { data: { buildName: prepareDeploy.buildName, options: deployOptions } });

    let result;
    do {
      result = (await context.request(GraphqlActions.deployStatus, { buildName: prepareDeploy.buildName })).deployStatus;
      context.logger.debug(result);
      await Utils.sleep(2000);
      context.spinner.stop();
      context.spinner.start(context.i18n.t("deploy_in_progress", { status: result.status, message: result.message }));
    } while (result.status !== DeployStatus.completeSuccess && result.status !== DeployStatus.completeError);

    if (result.status === DeployStatus.completeError) {
      let gqlError;
      try {
        gqlError = JSON.parse(result.message); // result.message contains valid gqlError, should be threw as is
      } catch (e) {
        throw new Error(result.message);
      }
      throw gqlError;
    }

    context.spinner.stop();
  },

  describe: translations.i18n.t("deploy_describe"),

  builder: (args: yargs.Argv): yargs.Argv => args
    .usage(translations.i18n.t("deploy_usage"))
    .option("plugins", {
      alias: "p",
      describe: translations.i18n.t("deploy_plugins_describe"),
      type: "array"
    })
    .option("mode", {
      alias: "m",
      describe: translations.i18n.t("deploy_mode_describe"),
      default: DeployModeType.project,
      type: "string",
      choices: Object.values(DeployModeType),
    })
};
