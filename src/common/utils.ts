import * as YAML from 'js-yaml';
import * as path from 'path';
import 'isomorphic-fetch';
import * as request from 'request';
import * as fs from 'fs';
import * as archiver from 'archiver';
import { Interactive } from './interactive';
import * as _ from 'lodash';
import { Context } from './context';
import { Readable } from 'stream';
import { CommandController } from '../engine/controllers/commandController';
import { StaticConfig } from '../config';
import { translations, Translations } from './translations';

const MemoryStream = require('memorystream');
const streamToBuffer = require('stream-to-buffer');

/* Yaml Parser consts */
const LINES_DELIMITER = '\n';
const COMMENT_TOKEN = '$comment';
const MIDDLE_LINE_COMMENT_TOKEN = '$MLcomment';

type workspace = { name: string; id: string };

export namespace Utils {
  export const undefault = (m: any) => {
    return m.default ? m.default : m;
  };

  export const safeExecution = (cmd: any): { result: any; error: Error } => {
    try {
      return {
        result: cmd(),
        error: null,
      };
    } catch (err) {
      return {
        result: null,
        error: err,
      };
    }
  };

  export const installFiles = (
    targetDirectory: string,
    files: Map<string, string>,
    fs: any,
    context: Context,
  ): string => {
    files.forEach((data, name) => {
      const fullName = path.join(targetDirectory, name);
      const fullPath = path.dirname(fullName);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath);
      }

      fs.writeFileSync(fullName, data);
      context.logger.debug('install file = ' + fullName);
    });
    return targetDirectory;
  };

  export const upload = async (url: string, fileStream: Readable, context: Context): Promise<void> => {
    context.logger.debug('start upload file');
    context.logger.debug('url: ' + url);

    return new Promise<void>((resolve, reject) => {
      streamToBuffer(fileStream, (err: Error, data: any) => {
        request(
          {
            method: 'PUT',
            url: url,
            body: data,
            headers: {
              'Content-Length': data.length,
            },
          },
          (err: any, res: any, body: any) => {
            if (err) {
              return reject(err);
            }
            if (res && res.statusCode !== 200) {
              return reject(new Error(res.body));
            }
            context.logger.debug('upload file success');
            resolve();
          },
        );
      });
    });
  };

  export const archiveToMemory = async (
    directories: { source: string; dist?: string }[],
    context: Context,
  ): Promise<Readable> => {
    const memoryStream = new MemoryStream(null);

    return new Promise<Readable>((resolve, reject) => {
      const zip = archiver('zip', { zlib: { level: 0 } });

      zip.pipe(memoryStream);

      directories.forEach(sourcePath => {
        const source = fs.statSync(sourcePath.source);
        context.logger.debug(
          'archive files from directory = ' +
            sourcePath.source +
            ' dist = ' +
            sourcePath.dist +
            ' is file = ' +
            source.isFile(),
        );

        source.isFile() ? zip.file(sourcePath.source, {}) : zip.directory(sourcePath.source, sourcePath.dist || false);
      });

      zip.on('error', (err: any) => {
        context.logger.debug('Error while zipping build: ' + err);
        reject(new Error(err));
      });

      zip.on('finish', () => {
        context.logger.debug('zipping finish');
        memoryStream.end();
        resolve(memoryStream);
      });

      zip.on('end', () => {
        context.logger.debug('zipping end');
      });

      zip.on('warning', (error: archiver.ArchiverError) => {
        context.logger.warn(error);
      });

      zip.finalize();
    });
  };

  export const promptWorkspace = async (workspaces: workspace[], context: Context): Promise<{ id: string }> => {
    if (_.isEmpty(workspaces)) {
      throw new Error(context.i18n.t('logout_error'));
    }

    if (workspaces.length === 1) {
      return workspaces[0];
    }

    const result = await Interactive.ask({
      name: 'workspace',
      type: 'select',
      message: 'choose workspace',
      choices: workspaces.map(workspace => {
        return {
          title: workspace.name,
          value: workspace.id,
        };
      }),
    });

    return {
      id: result.workspace,
    };
  };

  export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  export const trimLastSlash = (url: string): string => {
    if (!_.isString(url) || url.length === 0) {
      return '';
    }

    return url[url.length - 1] === '/' ? url.substr(0, url.length - 1) : url;
  };

  export const commandDirMiddleware = (commandsDirPath: string) => (
    commandObject: { [key: string]: any },
    pathName: string,
  ): Object => {
    const cmd = commandObject.default || commandObject;
    const fileDepth = path.relative(commandsDirPath, pathName).split(path.sep).length;

    if (fileDepth <= 2 && !!cmd.command) {
      return {
        ...cmd,
        handler: CommandController.wrapHandler(cmd.handler, translations),
      };
    }
  };

  /* Parses yaml string to JSON while preserving comments */
  export const yamlStringToJson = (str: string): Object => {
    const lines = str.split(LINES_DELIMITER);
    const middle_of_line_comment = /([^\#]+)(\#\s?)(.*)/;
    const start_of_line_comment = /^([\s]*)(\#\s?)(-?\s?)(.*)/;

    const strWithComments = lines
      .map((line, index) => {
        if (line.match(start_of_line_comment)) {
          return line.replace(start_of_line_comment, `$1$3${COMMENT_TOKEN}${index}: "$4"`);
        } else if (line.match(middle_of_line_comment)) {
          return line.replace(middle_of_line_comment, `$1${MIDDLE_LINE_COMMENT_TOKEN} "$3"`);
        } else {
          return line;
        }
      })
      .join(LINES_DELIMITER);

    return YAML.safeLoad(strWithComments, { json: true });
  };

  /* Creates yaml string from JSON while placing comments */
  export const yamlJsonToString = (jsonObject: Object): string => {
    const yamlAsString = YAML.safeDump(jsonObject, { indent: 2 });

    /* Catch middle of line comments */
    const MIDDLE_LINE_PATTERN = `(\\${MIDDLE_LINE_COMMENT_TOKEN})( ")(.*)(")`;
    const middleLineRegex = new RegExp(MIDDLE_LINE_PATTERN, 'g');

    const COMMENT_KEY_VALUE_PATTERN = `(\\${COMMENT_TOKEN}.*:)( ')(.*)(')`;
    const commentKeyValueRegex = new RegExp(COMMENT_KEY_VALUE_PATTERN, 'g');

    const SWITCH_SIGNS_PATTERN = `(- )?(\\${COMMENT_TOKEN}\\d*)(: )`;
    const switchSignsRegex = new RegExp(SWITCH_SIGNS_PATTERN, 'g');

    const COMMENT_TOKEN_TO_SIGN = `\\${COMMENT_TOKEN}\\d*`;
    const tokenToSignRegex = new RegExp(COMMENT_TOKEN_TO_SIGN, 'g');

    return yamlAsString
      .replace(commentKeyValueRegex, '$1 $3')
      .replace(middleLineRegex, '# $3')
      .replace(switchSignsRegex, '$2 $1')
      .replace(tokenToSignRegex, '#');
  };
}
