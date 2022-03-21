import * as yargs from 'yargs';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as simplegit from 'simple-git/promise';
import { translations } from '../../common/translations';
import { Context } from '../../common/context';
import { TableSchema } from '@8base/utils';
import { exportTables } from '@8base/api-client';
import { buildTemplateMainView } from '../templates/MainViewTemplate';
import {
  mapImportRoutes,
  mapRoutes,
  mapTableRows,
  mapTextFields,
  mapTextFieldsDetails,
} from '../templates/Utils';
import { buildTemplateRouter } from '../templates/RouterTemplate';
import { buildTemplateIconsRouter } from '../templates/IconsRoutertemplate';
import { buildCreateViewTemplate } from '../templates/CreateViewTemplate';
import { buildUpdateViewTemplate } from '../templates/UpdateViewTemplate';
import { buildDetailsViewTemplate } from '../templates/DetailsViewTemplate';

type AppParams = {
  _: string[];
  appName: string;
};

export default {
  command: 'cra <appName>',
  describe: translations.i18n.t('generate_app_describe'),
  builder: (yargs: yargs.Argv): yargs.Argv =>
    yargs.usage(translations.i18n.t('generate_app_usage')),
  handler: async (params: AppParams, context: Context) => {
    if (!context.user.isAuthorized()) {
      throw new Error(context.i18n.t('logout_error'));
    }
    const git = simplegit('.');
    const { appName, _ } = params;
    const commonFields = ['Created By', 'ID', 'Created At', 'Updated At'];
    const appRoute = `./${appName}`;
    const selectedTables = _;
    selectedTables.splice(0, 1);

    const tables: TableSchema[] = (
      await exportTables(context.request.bind(context), {
        withSystemTables: true,
      })
    ).filter(
      (table) => !table.isSystem && selectedTables.includes(table.displayName),
    );

    // const workspaceId = context.workspaceId;
    context.spinner.start('Fetching project skeleton');
    await git.clone(
      'https://github.com/cobuildlab/create-react-cra-typescript-app.git',
      appName,
    );
    // await fs.remove(path.join(appName, '.git'));
    // process.chdir(appName);
    console.log(`
     Welcome to Cobuild Lab's 8base starter project. Next Steps:
     
     1. Switch to the recently generated project: \`cd ${appName}\`
     2. Make sure to execute \`npm i\` to install dependencies.
     3. Setup your Auth0 credentials and 8base AUTH PROFILE ID in the \`.env\` files
     4. You can start generating more code using the \`xbase generate --help\` command
     5. Happy coding
     `);
    for (let i = 0; i <= tables.length - 1; i++) {
      const tableName = tables[i].displayName;
      // filter the fields by removing the common ones
      const filteredFields = tables[i].fields.filter(
        (f) => !commonFields.includes(f.displayName),
      );
      const fieldsNames = filteredFields.map((field) => field.displayName);
      const moduleNameMayus =
        tableName.charAt(0).toUpperCase() + tableName.slice(1);

      const mainView = buildTemplateMainView(
        moduleNameMayus,
        mapTableRows(fieldsNames, true),
        mapTableRows(fieldsNames, false),
      );

      const createView = buildCreateViewTemplate(
        moduleNameMayus,
        mapTextFields(filteredFields),
      );

      const updateView = buildUpdateViewTemplate(
        moduleNameMayus,
        mapTextFields(filteredFields),
      );

      const detailsView = buildDetailsViewTemplate(
        moduleNameMayus,
        mapTextFieldsDetails(fieldsNames),
      );

      // create the module folder
      fs.mkdir(`${appRoute}/src/modules/${tableName}`, (err) => {
        if (err) {
          console.log('err1', err);
        } else {
          // then create the components folder and the main view
          fs.mkdir(`${appRoute}/src/modules/${tableName}/components`, (err) => {
            if (err) console.log('err3', err);
          });

          fs.writeFile(
            `${appRoute}/src/modules/${tableName}/${moduleNameMayus}View.tsx`,
            mainView,
            (err) => {
              if (err) console.log('err2', err);
            },
          );

          fs.writeFile(
            `${appRoute}/src/modules/${tableName}/components/Create${moduleNameMayus}View.tsx`,
            createView,
            (err) => {
              if (err) console.log('err2', err);
            },
          );

          fs.writeFile(
            `${appRoute}/src/modules/${tableName}/components/Update${moduleNameMayus}View.tsx`,
            updateView,
            (err) => {
              if (err) console.log('err2', err);
            },
          );

          fs.writeFile(
            `${appRoute}/src/modules/${tableName}/components/${moduleNameMayus}DetailsView.tsx`,
            detailsView,
            (err) => {
              if (err) console.log('err2', err);
            },
          );
        }
      });
    }
    const moduleNames = tables.map((table) => table.displayName);
    const routerFile = buildTemplateRouter(
      mapImportRoutes(moduleNames),
      mapRoutes(moduleNames),
    );

    const iconsRouter = buildTemplateIconsRouter(moduleNames);
    fs.writeFile(`${appRoute}/src/routes.tsx`, routerFile, (err) =>
      console.log(err),
    );

    fs.writeFile(
      `${appRoute}/src/shared/components/Layout/Sidebar.tsx`,
      iconsRouter,
      (err) => console.log(err),
    );

    context.spinner.stop();
  },
};
