import * as path from 'path';
import * as fs from 'fs-extra';
import { execSync } from 'child_process';
import * as cuid from '@paralleldrive/cuid2';
import * as yaml from 'js-yaml';
import stripAnsi from 'strip-ansi';
import { CLI_BIN } from './consts';

export const prepareTestEnvironment = async (
  repName: string = cuid.createId(),
): Promise<{ onComplete: () => void; repPath: string }> => {
  const dir = cuid.createId();
  const fullPath = path.join(__dirname, dir);

  execSync(`mkdir ${fullPath}`);

  RunCommand.init(fullPath, repName);

  return {
    repPath: path.join(fullPath, repName),
    onComplete: () => {
      execSync(`rm -rf ${fullPath}`);
    },
  };
};

export const addResolverToProject = async (
  funcName: string,
  code: string,
  graphQLData: string,
  projectPath: string,
  ext: string = '.ts',
) => {
  const subDir = 'src';

  await fs.writeFile(path.join(projectPath, subDir, funcName).concat(ext), code);
  await fs.writeFile(path.join(projectPath, subDir, funcName).concat('.graphql'), graphQLData);
  const yamlFilePath = path.join(projectPath, '8base.yml');
  const yamlData: { functions: { [key: string]: any } } = <any>yaml.load(await fs.readFile(yamlFilePath, 'utf8'));

  yamlData.functions[funcName] = {
    handler: {
      code: path.join(subDir, funcName).concat(ext),
    },
    type: 'resolver',
    schema: path.join(subDir, funcName).concat('.graphql'),
  };

  await fs.writeFile(yamlFilePath, yaml.dump(yamlData));
};

export const addFileToProject = async (
  fileName: string,
  fileData: string,
  projectPath: string,
  pathPrefix: string = '',
): Promise<{ relativePathToFile: string; fullPathToFile: string }> => {
  const pathToDir = path.join(projectPath, pathPrefix);
  const pathToFile: string = path.join(pathToDir, fileName);
  execSync(`mkdir ${pathToDir}`);
  await fs.writeFile(pathToFile, fileData);
  return {
    relativePathToFile: path.join(pathPrefix, fileName),
    fullPathToFile: pathToFile,
  };
};

export namespace RunCommand {
  export const invokeLocal = async (funcName: string, repPath: string, input?: { path?: string; data?: object }) => {
    let command: string = `invoke-local ${funcName} `;

    if (input && input.data) {
      command += `-j '${JSON.stringify(input.data)}'`;
    } else if (input && input.path) {
      command += `-p ${input.path}`;
    }

    return execCmd(repPath, command);
  };

  export const init = (repPath: string, repName: string) => {
    return execCmd(repPath, `init ${repName} -w=workspaceId`);
  };
}

const execCmd = (repPath: string, command: string) => {
  return execSync(`cd ${repPath} && node ${CLI_BIN} ${command}`).toString();
};

export const expectInString = (template: string, expectedValue: string) => {
  const cleanString = (str: string): string => {
    return stripAnsi(
      str
        .replace(/^\s*\n+\s*/g, '')
        .replace(/\s*\n+\s*$/g, '')
        .replace(/\n+/g, ' ')
        .replace(/\s\s+/g, ' '),
    );
  };

  expect(cleanString(template)).toContain(cleanString(expectedValue));
};
