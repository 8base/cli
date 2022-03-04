import * as changeCase from 'change-case';
import * as ejs from 'ejs';
import * as pluralize from 'pluralize';
import { formatCode } from '../../formatCode';
import { IGeneratorsData } from '../../types';

// @ts-ignore
import index from './index.js.ejs';

export const generateIndex = ({ tablesList, tableId, screenName }: IGeneratorsData) => {
  const table = tablesList.find(({ id }) => tableId === id);

  if (!table) { throw new Error(`Can't find a table with ${tableId} id`); }

  const tableName = table.displayName || table.name;

  const entityName = pluralize.singular(screenName || tableName);

  const tableGenerated = ejs.render(index, {
    changeCase,
    entityName,
    pluralize,
    screenName: screenName || tableName,
    tableName,
  });

  return formatCode(tableGenerated);
};
