import * as fs from "fs-extra";
import * as path from "path";
import ignore from "ignore";
import * as _ from "lodash";
import { Readable } from "stream";
import * as recursiveReadDir from "recursive-readdir";

import { ProjectController } from "./projectController";
import { getCompiler } from "../compilers";
import { Context } from "../../common/context";
import { Utils } from "../../common/utils";

const IGNORE_FILE_PATH = "./.8baseignore";

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

    const compiledFiles = await compiler.compile(context.config.buildDistPath);
    context.logger.debug("compiled files = " + compiledFiles);

    return {
      compiledFiles
    };
  }

  /**
   * Private functions
   */

  private static async packageSources(context: Context): Promise<Readable> {

    const excludedDirectories = [
      context.config.buildDistFolder,
      context.config.packageFolder,
      context.config.metaFolder,
      context.config.buildRootFolder,
      context.config.modulesFolder,
      ".git",
      ".idea",
    ];

    const ignoreFilter = fs.existsSync(IGNORE_FILE_PATH) ? ignore().add(fs.readFileSync(IGNORE_FILE_PATH).toString()) : {
      ignores: () => false,
    };

    const files = await recursiveReadDir(context.config.rootExecutionDir, excludedDirectories);

    const sourceToArchive = files
      .map((file) => path.relative(process.cwd(), file))
      .filter((file) => !ignoreFilter.ignores(file))
      .map(file => ({ dist: file, source: file }));

    return Utils.archiveToMemory(sourceToArchive, context);
  }

  private static packageMetadata(context: Context): Promise<Readable> {
    const metaDir = context.config.metaDir;

    ProjectController.saveMetaDataFile(context.project, metaDir);
    ProjectController.saveSchema(context.project, metaDir);
    ProjectController.saveProject(context.project, metaDir);

    return Utils.archiveToMemory([ { source: metaDir }], context);
  }

  private static prepare(context: Context) {

    fs.removeSync(context.config.buildRootDirPath);

    fs.mkdirpSync(context.config.buildDistPath);
    fs.mkdirpSync(context.config.metaDir);
    fs.mkdirpSync(context.config.packageDir);
  }
}


