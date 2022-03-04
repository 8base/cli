import * as yargs from 'yargs';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as simplegit from 'simple-git/promise';
import {translations} from '../../common/translations';
import {Context} from '../../common/context';

type AppParams = {
    _: string[];
    appName: string;
};

export default {
    command: 'cra <appName>',
    describe: translations.i18n.t('generate_app_describe'),
    builder: (yargs: yargs.Argv): yargs.Argv => yargs.usage(translations.i18n.t('generate_app_usage')),
    handler: async (params: AppParams, context: Context) => {
        if (!context.user.isAuthorized()) {
            throw new Error(context.i18n.t('logout_error'));
        }
        const {appName} = params;
        const git = simplegit('.');

        // const workspaceId = context.workspaceId;
        context.spinner.start('Fetching project skeleton');
        await git.clone('https://github.com/cobuildlab/create-react-cra-typescript-app.git', appName);
        // await fs.remove(path.join(appName, '.git'));
        process.chdir(appName);
        console.log(`
        Welcome to Cobuild Lab's 8base starter project. Next Steps:
        
        1. Switch to the recently generated project: \`cd ${appName}\`
        2. Make sure to execute \`npm i\` to install dependencies.
        3. Setup your Auth0 credentials and 8base AUTH PROFILE ID in the \`.env\` files
        4. You can start generating more code using the \`xbase generate --help\` command
        5. Happy coding
        `);
        context.spinner.stop();
    },
};
