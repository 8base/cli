import * as path from 'path';
import { PredefineData } from './predefineData';

export class StaticConfig {
  private static staticData = new PredefineData();

  static get projectTemplatePath(): string {
    return this.staticData.projectTemplatePath;
  }

  static get functionTemplatesPath(): string {
    return this.staticData.functionTemplatesPath;
  }

  static get pluginTemplatePath(): string {
    return this.staticData.pluginTemplatePath;
  }

  static get rootProjectDir(): string {
    return this.staticData.projectDir;
  }

  static get rootExecutionDir(): string {
    return this.staticData.executionDir;
  }

  static get commandsDir(): string {
    return this.staticData.commandsPath;
  }

  static get homePath() {
    return process.env.USERPROFILE || process.env.HOME || process.env.HOMEPATH;
  }

  static get authDomain(): string {
    return this.staticData.authDomain;
  }

  static get authClientId(): string {
    return this.staticData.authClientId;
  }

  static get webClientAddress(): string {
    return this.staticData.webClientAddress;
  }

  static get apiAddress(): string {
    return this.staticData.apiAddress;
  }

  static get serviceConfigFileName(): string {
    return path.join(this.staticData.executionDir, '8base.yml');
  }

  static get configFileName(): string {
    return '8base.yml';
  }

  static get packageFileName(): string {
    return 'package.json';
  }

  static get defaultNodeVersion(): number {
    return 18;
  }

  /**
   * Compiler paths
   */

  static buildRootFolder = '.build';
  static buildDistFolder = 'dist';
  static modulesFolder = 'node_modules';
  static metaFolder = 'meta';
  static packageFolder = 'package';

  static buildRootDirPath = path.join(StaticConfig.rootExecutionDir, StaticConfig.buildRootFolder);
  static buildDistPath = path.join(StaticConfig.buildRootDirPath, StaticConfig.buildDistFolder);
  static metaDir = path.join(StaticConfig.buildRootDirPath, StaticConfig.metaFolder);
  static packageDir = path.join(StaticConfig.buildRootDirPath, StaticConfig.packageFolder);

  static supportedCompileExtension = new Set<string>(['.ts', '.js']);
}
