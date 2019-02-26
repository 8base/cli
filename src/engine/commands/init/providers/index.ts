import * as path from "path";
import * as readdir from "readdir";
import * as _ from "lodash";
import * as fs from "fs";
import { Context } from "../../../../common/context";

interface IFileProvider {
  /*async*/ provide(context: Context): Promise<Map<string, string>>;
}

class StaticFileProvider implements IFileProvider {
  async provide(context: Context): Promise<Map<string, string>> {
    return _.reduce<string, Map<string, string>>(readdir.readSync(context.config.templatePath), (result, file) => {
      return result.set(file, fs.readFileSync(path.join(context.config.templatePath, file)).toString());
    }, new Map<string, string>());
  }
}

export function getFileProvider(): IFileProvider {
  return new StaticFileProvider();
}