import { SchemaNameGenerator } from '@8base/schema-name-generator';
import { createQueryColumnsList, createTableFilterGraphqlTag, tableSelectors } from '@8base/utils';
import * as changeCase from 'change-case';
import * as ejs from 'ejs';
import * as pluralize from 'pluralize';
import { formatCode } from '../../formatCode';
import { GeneratorsConfig, IGeneratorsData } from '../../types';
import { chunks } from '../chunks';

// @ts-ignore
import tableTemplate from './table.js.ejs';

export const generateTable =
  ({ tablesList, tableId, screenName }: IGeneratorsData, config: GeneratorsConfig) => {
    const table = tablesList.find(({ id }) => tableId === id);

    if (!table) { throw new Error(`Can't find a table with ${tableId} id`); }

    const tableName = table.displayName || table.name;

    const entityName = pluralize.singular(screenName || tableName);
    const queryText = createTableFilterGraphqlTag(tablesList, tableId, config);
    const columns = createQueryColumnsList(tablesList, tableId, config);

    const tableGenerated = ejs.render(tableTemplate, {
      SchemaNameGenerator,
      changeCase,
      chunks,
      columns,
      entityName,
      pluralize,
      queryText,
      screenName: screenName || tableName,
      table,
      tableName,
      tableSelectors,
    });

    return formatCode(tableGenerated);
  };
