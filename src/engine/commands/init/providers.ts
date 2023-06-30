import * as path from 'path';
import * as fs from 'fs-extra';
import * as _ from 'lodash';
import { Context } from '../../../common/context';

interface IFileProvider {
  provide(context: Context): Map<string, string>;
}

class StaticFileProvider implements IFileProvider {
  provide(context: Context): Map<string, string> {
    return _.reduce<string, Map<string, string>>(
      fs.readdirSync(context.config.projectTemplatePath),
      (result, file) => {
        return result.set(
          file,
          fs.readFileSync(path.join(context.config.projectTemplatePath, file), { encoding: 'utf8' }),
        );
      },
      new Map<string, string>(),
    );
  }
}

export function getFileProvider(): IFileProvider {
  return new StaticFileProvider();
}
