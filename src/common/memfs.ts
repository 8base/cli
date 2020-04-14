import * as fs from 'fs-extra';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

const asyncForEach = async <T extends Object>(array: T[], callback: (arg0: T, arg1: number, arg2: T[]) => void) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const writeFile = async (relativePath: string, data: Object, options: Object) => {
  await mkdirp.sync(path.dirname(relativePath));

  await fs.writeFile(relativePath, data, options);
};

export const writeFs = async (fsObject: Record<string, string>, rootPath: string = './', options: Object = {}) => {
  await asyncForEach(Object.keys(fsObject), async (relativePath: string) => {
    const fileContent = fsObject[relativePath];

    await writeFile(path.join(rootPath, relativePath), fileContent, { encoding: 'utf8', ...options });
  });
};

export const readFs = async (filePaths: string[], rootPath: string = './') => {
  let fsObject: { [key: string]: string } = {};

  await asyncForEach(filePaths, async (relativePath: string) => {
    const fileContent = await fs.readFile(path.join(rootPath, relativePath), 'utf8');

    fsObject[relativePath] = fileContent;
  });

  return fsObject;
};
