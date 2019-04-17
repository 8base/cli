import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";
import cuid = require("cuid");
import * as yaml from "js-yaml";
import { CLI_BIN } from "./consts";

export const prepareTestEnvironment = async (repName: string = cuid()): Promise<{ onComplete: () => void, repPath: string }> => {
  const dir = cuid();
  const fullPath = path.join(__dirname, dir);

  execSync(`mkdir ${fullPath}`);

  execSync(`cd ${fullPath} && 8base init ${repName}`);

  return {
    repPath: path.join(fullPath, repName),
    onComplete: () => {
      execSync(`rm -r ${fullPath}`);
    }
  };
};

export const addResolverToProject = (funcName: string, code: string, graphQLData: string, projectPath: string, ext: string = ".ts") => {
  const subDir = "src";

  fs.writeFileSync(path.join(projectPath, subDir, funcName).concat(ext), code);
  fs.writeFileSync(path.join(projectPath, subDir, funcName).concat(".graphql"), graphQLData);
  const yamlFilePath = path.join(projectPath, "8base.yml");
  const yamlData: { functions: {[key: string]: any}} = <any>yaml.safeLoad(fs.readFileSync(yamlFilePath, "utf8"));

  yamlData.functions[funcName] = {
    handler: {
      code: path.join(subDir, funcName).concat(ext)
    },
    type: "resolver",
    schema: path.join(subDir, funcName).concat(".graphql")
  };

  fs.writeFileSync(yamlFilePath, yaml.safeDump(yamlData));
};


export const addFileToProject = (fileName: string, fileData: string, projectPath: string, pathPrefix: string = ""): { relativePathToFile: string, fullPathToFile: string } => {
  const pathTodir = path.join(projectPath, pathPrefix);
  const pathToFile: string = path.join(pathTodir, fileName);
  execSync(`mkdir ${pathTodir}`);
  fs.writeFileSync(pathToFile, fileData);
  return {
    relativePathToFile: path.join(pathPrefix, fileName),
    fullPathToFile: pathToFile
  };
};

export const invokeLocalFunction = async (funcName: string, repPath: string, input?: { path?: string, data?: object }) => {
  let command: string = `invoke-local ${funcName} `;

  if (input && input.data) {
    command += `-j '${JSON.stringify(input.data)}'`;
  } else if (input && input.path) {
    command += `-p ${input.path}`;
  }

  return execCmd(repPath, command);
};

const execCmd = (repPath: string, command: string) => {
  console.log("execution cmd: " + command);

  return execSync(`cd ${repPath} && node ${CLI_BIN} ${command}`).toString();
};

export const expectInString =(template: string, expectedValue: string) => {
  const cleanString = (str: string): string => {
    return str.replace(/^\s*\n+\s*/g, "")
      .replace(/\s*\n+\s*$/g, "")
      .replace(/\n+/g, " ")
      .replace(/\s\s+/g, " ");
  };

  expect(cleanString(template)).toContain(cleanString(expectedValue));
};
