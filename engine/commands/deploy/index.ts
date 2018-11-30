import { Utils } from "../../../common/utils";
import { GraphqlController } from "../../controllers/graphqlController";
import { BuildController } from "../../controllers/buildController";
import * as yargs from "yargs";
import { Context } from "../../../common/context";
import { GraphqlActions } from "../../../consts/GraphqlActions";
import { translations } from "../../../common/translations";
import { DeployStatus } from "../../../consts/DeployStatus";

export default {
  name: "deploy",
  handler: async (params: any, context: Context) => {
    context.spinner.start(context.i18n.t("deploy_in_progress", { status: "prepare to upload"}));

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

    await context.request(GraphqlActions.deploy, { data: { buildName: prepareDeploy.buildName } });

    let result;
    do {
      result = (await context.request(GraphqlActions.deployStatus, { buildName: prepareDeploy.buildName })).deployStatus;
      context.logger.debug(result);
      await Utils.sleep(2000);
      context.spinner.stop();
      context.spinner.start(context.i18n.t("deploy_in_progress", { status: result.status, message: result.message }));
    } while (result.status !== DeployStatus.completeSuccess && result.status !== DeployStatus.completeError);

    if (result.status === DeployStatus.completeError) {
      throw new Error(result.message);
    }

    context.spinner.stop();
  },

  describe: translations.i18n.t("deploy_describe"),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args.usage(translations.i18n.t("deploy_usage"));
  }
};
