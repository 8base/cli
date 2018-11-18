import * as fs from "fs-extra";
import { ProjectController } from "./projectController";
import { getCompiler } from "../compilers";
import { Context } from "../../common/context";
import { Utils } from "../../common/utils";
import _ = require("lodash");
import { Readable } from "stream";


/*
  paths:
    /project_dir
      - user's files / folders
      - node_modules
      - .build
        - dist (use for local compile when invoke-local command is invoked
        - meta (use for build meta for project)
        - package (use for package command)
 */

export class BuildController {

  /*
    Function workflow
      1. Clean up directory
      2. Create Metadata file
      3. Create Schema file and save it
      4. Archive build and summary
  */

  static async package(context: Context): Promise<{ build: Readable, meta: Readable }> {

    BuildController.prepare(context);

    return {
      build: await BuildController.packageSources(context),
      meta: await BuildController.packageMetadata(context)
    };
  }

  // compile use only for invoke-local command
  static async compile(context: Context): Promise<{ compiledFiles: string[] }> {

    BuildController.prepare(context);

    const files = ProjectController.getFunctionSourceCode(context);

    context.logger.debug("resolve compilers");
    const compiler = getCompiler(files, context);

    const compiledFiles = await compiler.compile(context.config.buildDistFolder);
    context.logger.debug("compiled files = " + compiledFiles);

    return {
      compiledFiles
    };
  }

  /**
   * Private functions
   */

  private static packageSources(context: Context): Promise<Readable> {

    const excludedDirectories = [
      context.config.buildDistFolder,
      context.config.packageFolder,
      context.config.metaFolder,
      context.config.buildRootFolder,
      context.config.modulesFolder
    ];

    const sourceToArchive = _.flow(
      () => BuildController.getSourceBuildData(context),
      (directories: string[]) => _.filter(directories, dir => !excludedDirectories.includes(dir)),
      (directories: string[]) => _.map(directories, dir => { return { dist: dir, source: dir }; })
    )();

    return Utils.archiveToMemory(sourceToArchive, context);
  }

  private static packageMetadata(context: Context): Promise<Readable> {
    const metaDir = context.config.metaDir;

    ProjectController.saveMetaDataFile(context.project, metaDir);
    ProjectController.saveSchema(context.project, metaDir);
    ProjectController.saveProject(context.project, metaDir);

    return Utils.archiveToMemory([ { source: metaDir }], context);
  }

  private static getSourceBuildData(context: Context): string[] {
    return fs.readdirSync(context.config.rootExecutionDir);
  }

  private static prepare(context: Context) {

    fs.removeSync(context.config.buildRootDirPath);

    fs.mkdirpSync(context.config.buildDistPath);
    fs.mkdirpSync(context.config.metaDir);
    fs.mkdirpSync(context.config.packageDir);
  }
}


