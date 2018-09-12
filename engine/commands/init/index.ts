import { getFileProvider } from "./providers";
import * as _ from "lodash";
import { install } from "./installer";
import * as yargs from "yargs";
import { Context, Translations } from "../../../common/Context";
import * as path from "path";
import { StaticConfig } from "../../../common";

export default {
  name: "init",
  handler: async (params: any, context: Context) => {

    const parameters = _.castArray(params._);

    const project = parameters.length > 1
      ? { fullPath: path.join(StaticConfig.rootExecutionDir, parameters[1]), name: parameters[1] }
      : { fullPath: StaticConfig.rootExecutionDir, name: path.basename(context.storage.static.rootExecutionDir) };


    context.logger.debug("start initiailie init command");

    context.logger.debug(`initialize success: initilize repository: ${project.name}`);

    let files = await getFileProvider().provide();
    context.logger.debug("files provided count = " + files.size);

    files.set(StaticConfig.packageFileName, replaceServiceName(files.get(StaticConfig.packageFileName)));

    context.logger.debug("try to install files");
    install(project.fullPath, files, context);

    context.logger.info(context.i18n.t("project_init_success", { project: project.name}));
  },
  // describe: 'Initialize project',
  builder: (args: yargs.Argv, translations: Translations): yargs.Argv => {
    return args
      .usage(translations.i18n.t("init_usage"))
      .example(translations.i18n.t("init_no_dir_example_command"), translations.i18n.t("init_example_no_dir"))
      .example(translations.i18n.t("init_with_dir_example_command"), translations.i18n.t("init_example_with_dir"));
  }
};


const replaceServiceName = (packageFile: string) => {
  let packagedata = JSON.parse(packageFile);
  packagedata.name = this.repositoryName;
  return JSON.stringify(packagedata, null, 2);
};