import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import { Context } from '../../../common/context';

interface IFileProvider {
  readDir(context: Context, dirPath: string): Promise<Map<string, string>>;
}

class StaticFileProvider implements IFileProvider {
  async readDir(context: Context, dirPath: string): Promise<Map<string, string>> {
    return _.reduce(
      fs.readdirSync(dirPath),
      (result, file) => result.set(file, fs.readFileSync(path.join(dirPath, file)).toString()),
      new Map<string, string>(),
    );
  }
}

export function getFileProvider(): IFileProvider {
  return new StaticFileProvider();
}
