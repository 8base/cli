import * as fs from "fs-extra";
import * as path from 'path';
import * as glob from "glob";
import { FunctionDefinition } from "../../interfaces/Extensions";
import { ProjectController } from "./projectController";
import { getCompiler } from "../compilers";
import { Context } from "../../common/context";
import { Selectors } from "../../common/selectors";
import { BuildDirectory } from "../../interfaces/Common";
import { Utils } from "../../common/utils";
import _ = require("lodash");



export class BuildController {

  /*
    Function workflow
      1. Clean up directory
      2. Create Metadata file
      3. Create Schema file and save it
      4. Archive build and summary
  */

  static async package(context: Context): Promise<{ build: string, summary: string }> {

    BuildController.prepare(context);

    // BuildController.makeFunctionHandlers(context.project.extensions.functions, context);

    return {
      build: await BuildController.packageSources(context),
      summary: await BuildController.packageMetadata(context)
    };
  }

  static async compile(context: Context, distPath: string): Promise<{ compiledFiles: string[] }> {

    const files = ProjectController.getFunctionSourceCode(context);

    context.logger.debug("resolve compilers");
    const compiler = getCompiler(files, context);

    const compiledFiles = await compiler.compile(distPath);
    context.logger.debug("compiled files = " + compiledFiles);

    return {
      compiledFiles
    };
  }

  /**
   * Private functions
   */

  private static async packageSources(context: Context) {

    BuildController.buildDistFolder(context);

    return await Utils.archive(
      [ context.config.buildDistPath ],
      context.config.buildRootDirPath,
      "build",
      context);
  }

  private static async packageMetadata(context: Context) {
    const summaryDir = context.config.summaryDir;

    ProjectController.saveMetaDataFile(context.project, summaryDir);

    ProjectController.saveSchema(context.project, summaryDir);

    ProjectController.saveProject(context.project, summaryDir);

    const archiveSummaryPath = await Utils.archive(
      [ summaryDir ],
      context.config.buildRootDirPath,
      "summary",
      context);

    return archiveSummaryPath;
  }

  private static buildDistFolder(context: Context) {

    const excludedDirectories = [
      context.config.buildDistFolder,
      context.config.buildRootFolder,
      context.config.modulesFolder
    ];

    _.flow(
      () => BuildController.getSourceBuildData(context),
      (directories: string[]) => _.filter(directories, dir => !excludedDirectories.includes(dir)),
      (directories: string[]) => _.map(directories, dir => {
        fs.copySync(path.resolve(context.config.rootExecutionDir, dir), path.resolve(context.config.buildDistPath, dir));
      })
    )();
  }

  private static getSourceBuildData(context: Context): string[] {
    return fs.readdirSync(context.config.rootExecutionDir);
  }

  private static makeFunctionHandlers(functions: FunctionDefinition[], context: Context) {

    functions.forEach(func => {
      context.logger.debug("process function = " + func.name);
      BuildController.makeFunctionWrapper(func.name, func.pathToFunction.replace(ext, ""), context);
    });
  }

  private static makeFunctionWrapper(name: string, functionPath: string, context: Context) {

    const fullWrapperFuncPath = path.join(context.config.buildDistPath, name.concat(context.config.FunctionHandlerExt));

    context.logger.debug("full function path = " + fullWrapperFuncPath);

    fs.writeFileSync(

      fullWrapperFuncPath,

      fs.readFileSync(context.config.functionWrapperPath)
        .toString()
        .replace("__functionname__", functionPath)
        .replace("__remote_server_endpoint__", Selectors.getServerAddress(context))
    );

    context.logger.debug("write func wrapper compete");
  }

  private static prepare(context: Context) {

    fs.removeSync(context.config.buildRootDirPath);

    fs.mkdirpSync(context.config.buildDistPath);
    fs.mkdirpSync(context.config.summaryDir);
  }
}


