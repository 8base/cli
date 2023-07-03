import * as fs from 'fs-extra';
import * as path from 'path';
import ignore from 'ignore';
import { Readable } from 'stream';

import { ProjectController } from './projectController';
import { getCompiler } from '../compilers';
import { StaticConfig } from '../../config';
import { Context } from '../../common/context';
import { Utils } from '../../common/utils';

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
  public static async clearBuild(context: Context) {
    await fs.remove(context.config.buildRootDirPath);
  }

  /*
        Function workflow
          1. Clean up directory
          2. Create Metadata file
          3. Create Schema file and save it
          4. Archive build and summary
      */

  static async package(context: Context): Promise<{ build: Readable; meta: Readable }> {
    await BuildController.prepare(context);

    return {
      build: await BuildController.packageSources(context),
      meta: await BuildController.packageMetadata(context),
    };
  }

  // compile use only for invoke-local command
  static async compile(context: Context): Promise<{ compiledFiles: string[] }> {
    await BuildController.prepare(context);

    const files = ProjectController.getFunctionSourceCode(context);

    context.logger.debug('resolve compilers');
    const compiler = getCompiler(files, context);

    const compiledFiles = await compiler.compile(context.config.buildDistPath);
    context.logger.debug(`compiled files = ${compiledFiles}`);

    return {
      compiledFiles,
    };
  }

  /**
   * Private functions
   */

  private static async packageSources(context: Context): Promise<Readable> {
    const excludedRoots = [
      context.config.buildRootFolder,
      context.config.buildDistFolder,
      context.config.modulesFolder,
      context.config.metaFolder,
      context.config.packageFolder,
      '.git',
      '.idea',
    ];

    // have to add '/' at the beginning to ignore only root folder. avoid recursive
    const ignoreFilter = ignore().add(excludedRoots.map(item => `/${item}`));

    if (await fs.exists(StaticConfig.ignoreFileName)) {
      ignoreFilter.add(await fs.readFile(StaticConfig.ignoreFileName, { encoding: 'utf8' }));
    }

    const files = await fs.readdir(context.config.rootExecutionDir);

    const sourceToArchive = files
      .map(file => path.relative(process.cwd(), file))
      .filter(file => !ignoreFilter.ignores(file))
      .map(file => ({ dist: file, source: file }));

    return Utils.archiveToMemory(sourceToArchive, context);
  }

  private static async packageMetadata(context: Context): Promise<Readable> {
    const metaDir = context.config.metaDir;

    await ProjectController.saveMetaDataFile(context.project, metaDir);
    await ProjectController.saveSchema(context.project, metaDir);
    await ProjectController.saveProject(context.project, metaDir);

    return Utils.archiveToMemory([{ source: metaDir }], context);
  }

  private static async prepare(context: Context) {
    await fs.remove(context.config.buildRootDirPath);

    await fs.ensureDir(context.config.buildDistPath);
    await fs.ensureDir(context.config.metaDir);
    await fs.ensureDir(context.config.packageDir);
  }
}
