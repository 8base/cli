import * as _ from "lodash";
import * as yargs from "yargs";
import * as path from "path";
import chalk from "chalk";
import * as tree from "tree-node-cli";

import { getFileProvider } from "./providers";
import { install } from "./installer";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { Colors } from "../../../consts/Colors";

export default {
  command: "init",
  handler: async (params: any, context: Context) => {

    const parameters = _.castArray(params._);

    const project = parameters.length > 1
      ? { fullPath: path.join(context.config.rootExecutionDir, parameters[1]), name: parameters[1] }
      : { fullPath: context.config.rootExecutionDir, name: path.basename(context.config.rootExecutionDir) };


    context.spinner.start(`Initializing new project ${chalk.hex(Colors.yellow)(project.name)}`);

    context.logger.debug("start initialize init command");

    context.logger.debug(`initialize success: initialize repository: ${project.name}`);

    let files = await getFileProvider().provide(context);
    context.logger.debug("files provided count = " + files.size);

    files.set(context.config.packageFileName, replaceServiceName(files.get(context.config.packageFileName), project.name));

    context.logger.debug("try to install files");
    install(project.fullPath, files, context);

    context.spinner.stop();

    // @ts-ignore
    const fileTree:string = tree(context.config.templatePath);

    context.logger.info(project.name);
    context.logger.info(fileTree.replace(/[^\n]+\n/, ""));

    context.logger.info(`Project ${chalk.hex(Colors.yellow)(project.name)} was successfully create!`);
  },
  describe: translations.i18n.t("init_describe"),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("init_usage"))
      .example(translations.i18n.t("init_no_dir_example_command"), translations.i18n.t("init_example_no_dir"))
      .example(translations.i18n.t("init_with_dir_example_command"), translations.i18n.t("init_example_with_dir"));
  }
};


const replaceServiceName = (packageFile: string, repositoryName: string) => {
  let packageData = JSON.parse(packageFile);
  packageData.name = repositoryName;
  return JSON.stringify(packageData, null, 2);
};
