import { debug, trace } from "../common";
import * as path from "path";
import 'isomorphic-fetch';
import * as request from "request";
import * as fs from "fs";
import * as archiver from "archiver";
import { Interactive } from "./interactive";
import _ = require("lodash");
import { Context } from "./Context";
import { StorageParameters } from "../consts/StorageParameters";

type workspace = { name: string, account: string };

export namespace Utils {
  export const undefault = (m: any) => {
    return m.default ? m.default : m;
  };

  export const safeExecution = (cmd: any): { result: any, error: Error } => {
    try {
      return {
        result: cmd(),
        error: null
      };
    } catch (err) {
      debug(err);
      return {
        result: null,
        error: err
      };
    }
  };

  export const installFiles = (targetDirectory: string, files: Map<string, string>, fs: any): string => {
    files.forEach((data, name) => {
      const fullName = path.join(targetDirectory, name);
      const fullPath = path.dirname(fullName);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath);
      }

      fs.writeFileSync(fullName, data);
      debug("install file = " + fullName);
    });
    return targetDirectory;
  };

  export const upload = async (url: any, filepath: any): Promise<any> => {
    const data = fs.readFileSync(filepath);
    debug("start upload file");
    debug("url: " + url);
    debug("filepath: " + filepath);
    return new Promise<any>((resolve, reject) => {
      request({
        method: "PUT",
        url: url,
        body: data,
        headers: {
          'Content-Length': data.length
        }
      },
        (err: any, res: any, body: any) => {
          if (err) {
            return reject(err);
          }
          if (res && res.statusCode !== 200) {
            return reject(new Error(res.body));
          }
          debug("upload file \"" + filepath + "\" success");
          resolve(path.basename(filepath));
        });
    });
  };

  export const archive = async (
    sourceDirectories: { source: string, dist?: string }[],
    outDir: string,
    buildName: string,
    filters?: string[]): Promise<string> => {
    const fullPath = path.join(outDir, buildName + '.zip');

    sourceDirectories.map(p => debug("archive source path = " + p));
    debug("archive dest path = " + fullPath);

    return new Promise<string>((resolve, reject) => {
      const zip = archiver("zip", { zlib: { level: 8 } });
      const write = fs.createWriteStream(fullPath);

      zip.pipe(write);

      sourceDirectories.forEach((directory) => {
        debug("archive files from directory = " + directory.source);
        zip.directory(directory.source, directory.dist ? directory.dist : "");
      });

      zip.on('error', (err: any) => {
        debug('Error while zipping build: ' + err);
        reject();
      });

      zip.on('finish', (err: any) => {
        debug('finish');
      });

      zip.on('close', (err: any) => {
        debug('close');
      });

      zip.on('end', (err: any) => {
        debug('end');
        resolve(fullPath);
      });

      zip.finalize(); // ?????
    });
  };



  const promptWorkspace = async (accounts: workspace[]): Promise<workspace> => {
    return (await Interactive.ask({
      name: "workspace",
      type: "select",
      message: "choose workspace",
      choices: accounts.map(account => {
        return {
          title: account.name,
          value: account.account
        };
      })
    })).workspace;
  };

  export const selectWorkspace = async (params: { w: string }, context: Context) => {
    const accounts = context.storage.user.getValue(StorageParameters.workspaces);

    if (_.isEmpty(accounts)) {
      throw new Error("You are logout");
    }

    const workspaceId = params && params.w ? params.w : await promptWorkspace(accounts);

    const activeWorkspace = accounts.find((account: any) => account.account === workspaceId);
    if (!activeWorkspace) {
      throw new Error("Workspace " + workspaceId + " is absent");
    }

    context.storage.user.setValues([
      {
        name: StorageParameters.activeWorkspace,
        value: activeWorkspace
      }
    ]);

    trace("Workspace " + activeWorkspace.name + " is active");
  };
}
