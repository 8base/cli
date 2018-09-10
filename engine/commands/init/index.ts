import { getFileProvider } from "./providers";
import * as _ from "lodash";
import { install } from "./installer";
import * as yargs from "yargs";
import { Context } from "../../../common/Context";

// import { waitForAnswer } from "../../../common/prompt";
import { debug, StaticConfig, trace } from "../../../common";
import { Interactive } from "../../../common/interactive";

const selectProjectName = async (): Promise<string> => {
  return (await Interactive.ask({ type: "text", name: "name", message: "Project name:" })).name;
};

export default {
  name: "init",
  handler: async (params: any, context: Context) => {

    debug("start initiailie init command");

    const projectName = params.n ? params.n : await selectProjectName();

    debug("initialize success: initilize repository = " + projectName);

    try {
      let files = await getFileProvider().provide();
      debug("files provided count = " + files.size);

      files.set(StaticConfig.packageFileName, replaceServiceName(files.get(StaticConfig.packageFileName)));

      debug("try to install files");
      install(StaticConfig.rootExecutionDir, projectName, files);

      trace(`Project ${projectName} initialize success`);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  describe: 'Initialize project',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .option("n", {
        alias: 'name',
        describe: "project name"
      })
      .usage("8base init [OPTIONS]")
      .help()
      .version(false);
  }
};


const replaceServiceName = (packageFile: string) => {
  let packagedata = JSON.parse(packageFile);
  packagedata.name = this.repositoryName;
  return JSON.stringify(packagedata, null, 2);
};