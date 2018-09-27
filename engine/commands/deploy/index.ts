import { Utils } from "../../../common/utils";
import { GraphqlController } from "../../controllers/graphqlController";
import { BuildController } from "../../controllers/buildController";
import * as yargs from "yargs";
import { Context } from "../../../common/context";
import { GraphqlActions } from "../../../consts/GraphqlActions";
import { translations } from "../../../common/translations";

export default {
  name: "deploy",
  handler: async (params: any, context: Context) => {
    context.spinner.start(context.i18n.t("deploy_in_progress"));

    if (params["validate_schema"]) {
      GraphqlController.validateSchema(context.project);
    }

    const buildDir = await BuildController.compile(context);
    context.logger.debug(`build dir: ${buildDir}`);

    const archiveBuildPath = await Utils.archive(
      [{ source: buildDir.build }, { source: context.config.modules, dist: "node_modules" }],
      context.config.buildRootDir,
      "build",
      context);

    const archiveSummaryPath = await Utils.archive(
      [{ source: buildDir.summary }],
      context.config.buildRootDir,
      "summary",
      context);

    const { prepareDeploy } = await context.request(GraphqlActions.prepareDeploy);

    await Utils.upload(prepareDeploy.uploadMetaDataUrl, archiveSummaryPath, context);
    context.logger.debug("upload summary data complete");

    await Utils.upload(prepareDeploy.uploadBuildUrl, archiveBuildPath, context);
    context.logger.debug("upload source code complete");

    await context.request(GraphqlActions.deploy, { data: { buildName: prepareDeploy.buildName } });
    context.spinner.stop();
  },

  describe: translations.i18n.t("deploy_describe"),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args.usage(translations.i18n.t("deploy_usage"));
  }
};
