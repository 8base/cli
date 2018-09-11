import { debug, StaticConfig, Utils, trace } from "../../../common";
import { GraphqlController } from "../../controllers/graphqlController";
import { BuildController } from "../../controllers/buildController";
import * as yargs from "yargs";
import { Context } from "../../../common/Context";
import { GraphqlActions } from "../../../consts/GraphqlActions";

export default {
  name: "deploy",
  handler: async (params: any, context: Context) => {

    if (params["validate_schema"]) {
      GraphqlController.validateSchema(context.project);
    }

    const buildDir = await BuildController.compile(context);
    debug("build dir = " + buildDir);

    const archiveBuildPath = await Utils.archive(
      [{ source: buildDir.build }, { source: StaticConfig.modules, dist: "node_modules" }],
      StaticConfig.buildRootDir,
      "build");

    const archiveSummaryPath = await Utils.archive(
      [{ source: buildDir.summary }],
      StaticConfig.buildRootDir,
      "summary");

    const { prepareDeploy } = await context.request(GraphqlActions.prepareDeploy);

    await Utils.upload(prepareDeploy.uploadMetaDataUrl, archiveSummaryPath);
    debug("upload summary data complete");

    await Utils.upload(prepareDeploy.uploadBuildUrl, archiveBuildPath);
    debug("upload source code complete");

    await context.request(GraphqlActions.deploy, { data: { buildId: prepareDeploy.buildId } });
    trace("deploy success");
  },
  describe: 'Deploy project',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage("8base deploy [OPTIONS]")
      .help()
      .version(false);
  }
};
