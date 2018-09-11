import { getFileProvider } from "./providers";
import * as _ from "lodash";
import { install } from "./installer";
import * as yargs from "yargs";
import { Context } from "../../../common/Context";
import * as path from "path";
import { debug, StaticConfig, trace } from "../../../common";

export default {
  name: "init",
  handler: async (params: any, context: Context) => {

    const parameters = _.castArray(params._);

    const project = parameters.length > 1
      ? { fullPath: path.join(StaticConfig.rootExecutionDir, parameters[1]), name: parameters[1] }
      : { fullPath: StaticConfig.rootExecutionDir, name: path.basename(context.storage.static.rootExecutionDir) };


    debug("start initiailie init command");

    debug("initialize success: initilize repository = " + project.name);

    let files = await getFileProvider().provide();
    debug("files provided count = " + files.size);

    files.set(StaticConfig.packageFileName, replaceServiceName(files.get(StaticConfig.packageFileName)));

    debug("try to install files");
    install(project.fullPath, files);

    trace(`Project ${project.name} initialize success`);
  },
  describe: 'Initialize project',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage("8base init [DIRECTORY]")
      .example("8base init", "initialize current folder")
      .example("8base init dir1", "create folder dir1 and initialize")
      .help()
      .version(false);
  }
};


const replaceServiceName = (packageFile: string) => {
  let packagedata = JSON.parse(packageFile);
  packagedata.name = this.repositoryName;
  return JSON.stringify(packagedata, null, 2);
};