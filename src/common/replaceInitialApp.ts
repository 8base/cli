/*
 * The original functionality is taken from the @8base/generators library
 * published under the MIT license at this URL:
 * https://www.npmjs.com/package/@8base/generators
 */

const FS_NAMES = {
  APPLICATION_JS: 'src/Application.js',
  APPOLO_CONFIG_JS: 'apollo.config.js',
  EIGHT_BASE_YML: '.8base.yml',
  PACKAGE_JSON: 'package.json',
  PACKAGE_LOCK_JSON: 'package-lock.json',
};

interface IAppFs {
  [path: string]: string;
}

interface IAppFsConstants {
  endpoint?: string;
  authClientId?: string;
  authDomain?: string;
  apiToken?: string;
  appName: string;
}

const removePieceOfCode = (code: string, pieceName: string) => {
  const pieceStart = `\\/\\*\\*\\s*__${pieceName}_START__\\s*\\*\\/`;
  const pieceEnd = `\\/\\*\\*\\s*__${pieceName}_END__\\s*\\*\\/`;
  const regexp = new RegExp(`${pieceStart}[\\s\\S]*${pieceEnd}`, 'm');
  return code.replace(regexp, '');
};

export const replaceInitialApp = (
  fsObject: IAppFs,
  constants: IAppFsConstants,
  config: { authMode: 'web' | 'api-token' } = { authMode: 'web' },
): IAppFs => {
  const fsObjectReplaced: IAppFs = {};
  const isApiTokenMode = config.authMode === 'api-token';

  Object.keys(fsObject).forEach(filePath => {
    switch (filePath) {
      case FS_NAMES.APPLICATION_JS: {
        fsObjectReplaced[FS_NAMES.APPLICATION_JS] = isApiTokenMode
          ? fsObject[FS_NAMES.APPLICATION_JS] &&
            removePieceOfCode(fsObject[FS_NAMES.APPLICATION_JS], 'AUTH_WEB')
              .replace('__APP_API_TOKEN__', constants.apiToken || '')
              .replace('__APP_API_ENDPOINT__', constants.endpoint || '')
          : fsObject[FS_NAMES.APPLICATION_JS] &&
            removePieceOfCode(fsObject[FS_NAMES.APPLICATION_JS], 'AUTH_API_TOKEN')
              .replace('__APP_API_ENDPOINT__', constants.endpoint || '')
              .replace('__APP_AUTH_CLIENT_ID__', constants.authClientId || '')
              .replace('__APP_AUTH_DOMAIN__', constants.authDomain || '');
        break;
      }
      case FS_NAMES.PACKAGE_JSON: {
        fsObjectReplaced[FS_NAMES.PACKAGE_JSON] =
          fsObject[FS_NAMES.PACKAGE_JSON] &&
          fsObject[FS_NAMES.PACKAGE_JSON]
            .replace(/"name": ".*"/, `"name": "${constants.appName}"`)
            .replace(/"version": ".*"/, '"version": "1.0.0"');
        break;
      }
      case FS_NAMES.PACKAGE_LOCK_JSON: {
        fsObjectReplaced[FS_NAMES.PACKAGE_LOCK_JSON] =
          fsObject[FS_NAMES.PACKAGE_LOCK_JSON] &&
          fsObject[FS_NAMES.PACKAGE_LOCK_JSON]
            .replace(/"name": ".*"/, `"name": "${constants.appName}"`)
            .replace(/"version": ".*"/, '"version": "1.0.0"');
        break;
      }
      default: {
        fsObjectReplaced[filePath] =
          fsObject[filePath] &&
          fsObject[filePath]
            .replace('__APP_API_ENDPOINT__', constants.endpoint || '')
            .replace('__APP_AUTH_CLIENT_ID__', constants.authClientId || '')
            .replace('__APP_AUTH_DOMAIN__', constants.authDomain || '')
            .replace('__APP_NAME__', constants.appName || '');
        break;
      }
    }
  });

  fsObjectReplaced[FS_NAMES.EIGHT_BASE_YML] = `appName: ${constants.appName}`;

  return fsObjectReplaced;
};
