import * as yargs from 'yargs';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as simplegit from 'simple-git/promise';
import { translations } from '../../../../common/translations';
import { Context } from '../../../../common/context';
import { StorageParameters } from '../../../../consts/StorageParameters';
import { readFs, writeFs } from '../../../../common/memfs';
import { replaceInitialApp, REPO_BRANCH_NAME } from '@8base/generators';

type AppParams = {
  _: string[];
  appName: string;
};

export default {
  command: 'app <appName>',
  describe: translations.i18n.t('generate_app_describe'),
  builder: (yargs: yargs.Argv): yargs.Argv => yargs.usage(translations.i18n.t('generate_app_usage')),
  handler: async (params: AppParams, context: Context) => {
    if (!context.user.isAuthorized()) {
      throw new Error(context.i18n.t('logout_error'));
    }

    const { appName } = params;
    const git = simplegit('.');

    const workspaceId = context.workspaceId;

    context.spinner.start('Fetching project skeleton');
    await git.clone('https://github.com/8base/react-app-starter.git', appName, ['--branch', REPO_BRANCH_NAME]);
    await fs.remove(path.join(appName, '.git'));

    process.chdir(appName);

    const fsObject = await readFs([
      'src/Application.js',
      'src/components/Header.js',
      'apollo.config.js',
      'package.json',
      'package-lock.json',
    ]);

    const replacedFsObject = replaceInitialApp(
      fsObject,
      {
        endpoint: `https://api.8base.com/${workspaceId}`,
        authClientId: context.storage.getValue(StorageParameters.authClientId),
        authDomain: context.storage.getValue(StorageParameters.authDomain),
        appName,
      },
      {
        authMode: 'web',
      },
    );

    await writeFs(replacedFsObject);

    context.spinner.stop();
  },
};
