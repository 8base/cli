import * as path from "path";
import 'isomorphic-fetch';
import * as request from "request";
import * as fs from "fs";
import * as archiver from "archiver";
import { Interactive } from "./interactive";
import * as _ from "lodash";
import { Context } from "./context";
import { StorageParameters } from "../consts/StorageParameters";

import chalk from "chalk";
import { i18n } from "i18next";
import locales from "../locales";


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
      return {
        result: null,
        error: err
      };
    }
  };

  export const installFiles = (targetDirectory: string, files: Map<string, string>, fs: any, context: Context): string => {
    files.forEach((data, name) => {
      const fullName = path.join(targetDirectory, name);
      const fullPath = path.dirname(fullName);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath);
      }

      fs.writeFileSync(fullName, data);
      context.logger.debug("install file = " + fullName);
    });
    return targetDirectory;
  };

  export const upload = async (url: any, filepath: any, context: Context): Promise<any> => {
    const data = fs.readFileSync(filepath);
    context.logger.debug("start upload file");
    context.logger.debug("url: " + url);
    context.logger.debug("filepath: " + filepath);
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
          context.logger.debug("upload file \"" + filepath + "\" success");
          resolve(path.basename(filepath));
        });
    });
  };

  export const archive = async (
    sourceDirectories: { source: string, dist?: string }[],
    outDir: string,
    buildName: string,
    context: Context): Promise<string> => {
    const fullPath = path.join(outDir, buildName + '.zip');

    sourceDirectories.map(p => context.logger.debug("archive source path = " + p));
    context.logger.debug("archive dest path = " + fullPath);

    return new Promise<string>((resolve, reject) => {
      const zip = archiver("zip", { zlib: { level: 8 } });
      const write = fs.createWriteStream(fullPath);

      zip.pipe(write);

      sourceDirectories.forEach((directory) => {
        context.logger.debug("archive files from directory = " + directory.source);
        zip.directory(directory.source, directory.dist ? directory.dist : "");
      });

      zip.on('error', (err: any) => {
        context.logger.debug('Error while zipping build: ' + err);
        reject();
      });

      zip.on('finish', (err: any) => {
        context.logger.debug('finish');
      });

      zip.on('close', (err: any) => {
        context.logger.debug('close');
      });

      zip.on('end', (err: any) => {
        context.logger.debug('end');
        resolve(fullPath);
      });

      zip.finalize();
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
      throw new Error(context.i18n.t("logout_error"));
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

    context.logger.info(`Workspaces ${chalk.yellowBright(activeWorkspace.name)} is active`);
  };

  export const initTranslations = async (i18next: i18n) => {
    return new Promise((resolve, reject) => {
      i18next.init({
        fallbackLng: "en",
        debug: false,
        defaultNS: "default",
        resources: locales
      }, (err, t) => {
        if (err) return reject(err);

        resolve();
      });
    });
  };

}
