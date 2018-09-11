import { StaticConfig, Utils } from "../../../common";
import { BuildController } from "../../controllers/buildController";
import * as yargs from "yargs";
import { Context } from "../../../common/Context";

export default {
  name: "package",
  handler: async (params: any, context: Context) => {

    const buildDir = await BuildController.compile(context);
    context.logger.debug(`build dir ${JSON.stringify(buildDir, null, 2)}`);

    await Utils.archive(
      [{ source: buildDir.build }, { source: StaticConfig.modules, dist: "node_modules" }],
      StaticConfig.buildRootDir,
      "build",
      context);

    await Utils.archive(
      [{ source: buildDir.summary }],
      StaticConfig.buildRootDir,
      "summary",
      context);
  },
  describe: 'Compile project',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args.usage("8base package [OPTIONS]");
  }
};
