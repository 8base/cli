
import { TableSchema } from '@8base/utils';
import * as changeCase from 'change-case';
import * as os from 'os';
import * as pluralize from 'pluralize';

import { formatCode } from '../formatCode';
import { chunks } from '../generateFiles/chunks';
import { generateCreateForm } from '../generateFiles/generateCreateForm/createForm';
import { generateDeleteForm } from '../generateFiles/generateDeleteForm/deleteForm';
import { generateEditForm } from '../generateFiles/generateEditForm/editForm';
import { generateIndex } from '../generateFiles/generateIndex';
import { generateTable } from '../generateFiles/generateTable/table';
import { IGeneratorsCommonConfig, IScreenTable } from '../types';
import {
  getCreateFormFileName,
  getDeleteFormFileName,
  getEditFormFileName,
  getScreenFolderName,
  getTableFileName,
} from './generateFileNames';

interface IGenerateProjectFsData {
  tablesList: TableSchema[];
  screen: IScreenTable;
  rootFile?: string;
}

const PAGE_CONSTANTS = {
  APP_PAGES_IMPORTS: '/** __APP_PAGES_IMPORTS__ */',
  APP_ROUTES: '{/** __APP_ROUTES__ */}',
  APP_ROUTE_LINKS: '{/** __APP_ROUTE_LINKS__ */}',
};

export const generateScreen =
  ({ tablesList, screen, rootFile }: IGenerateProjectFsData, config: IGeneratorsCommonConfig) => {
    const fs: { [key: string]: string } = {};
    const { screenName, tableId, tableFields, formFields } = screen;
    const generatorData = { tablesList, tableId, screenName };
    const routeUrl = `/${changeCase.camel(screenName)}`;

    const entityName = pluralize.singular(screenName);

    fs[`src/routes/${getScreenFolderName(screenName)}/${getCreateFormFileName(entityName)}`] =
      generateCreateForm(generatorData, { ...config, includeColumns: formFields });

    fs[`src/routes/${getScreenFolderName(screenName)}/${getEditFormFileName(entityName)}`] =
      generateEditForm(generatorData, { ...config, includeColumns: formFields });

    fs[`src/routes/${getScreenFolderName(screenName)}/${getDeleteFormFileName(entityName)}`] =
      generateDeleteForm(generatorData);

    fs[`src/routes/${getScreenFolderName(screenName)}/${getTableFileName(screenName)}`] =
      generateTable(generatorData, { ...config, includeColumns: tableFields });

    fs[`src/routes/${getScreenFolderName(screenName)}/index.js`] =
      generateIndex(generatorData);

    if (typeof rootFile === 'string') {
      fs['src/Root.js'] = formatCode(
        rootFile
          .replace(
            `${PAGE_CONSTANTS.APP_PAGES_IMPORTS}`,
            `${PAGE_CONSTANTS.APP_PAGES_IMPORTS}${os.EOL}${chunks.routeImport({ screenName, changeCase })}`,
          )
          .replace(
            `${PAGE_CONSTANTS.APP_ROUTE_LINKS}`,
            `${PAGE_CONSTANTS.APP_ROUTE_LINKS}${os.EOL}${chunks.routeLink({ screenName, routeUrl, changeCase })}`,
          )
          .replace(
            `${PAGE_CONSTANTS.APP_ROUTES}`,
            `${PAGE_CONSTANTS.APP_ROUTES}${os.EOL}${chunks.routeComponent({ screenName, routeUrl, changeCase })}`,
          ),
      );
    }

    return fs;
  };
