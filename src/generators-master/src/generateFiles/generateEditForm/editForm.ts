import { SchemaNameGenerator } from '@8base/schema-name-generator';
import { createTableRowQueryTag, createTableRowUpdateTag , tableSelectors } from '@8base/utils';
import * as changeCase from 'change-case';
import * as ejs from 'ejs';
import * as pluralize from 'pluralize';
import { formatCode } from '../../formatCode';
import { GeneratorsConfig, IGeneratorsData } from '../../types';
import { isFieldNeedsToInclude } from '../../utils';
import { chunks } from '../chunks';

// @ts-ignore
import editForm from './editForm.js.ejs';

export const generateEditForm =
  ({ tablesList, tableId, screenName }: IGeneratorsData, { includeColumns }: GeneratorsConfig = {}) => {
    const table = tablesList.find(({ id }) => tableId === id);

    if (!table) { throw new Error(`Can't find a table with ${tableId} id`); }

    const tableName = table.displayName || table.name;

    const entityName = pluralize.singular(screenName || tableName);
    const mutationText = createTableRowUpdateTag(tablesList, tableId);
    const queryEntityText = createTableRowQueryTag(tablesList, tableId, { withMeta: false });
    const fields = table.fields.filter(({ isMeta, name }) => !isMeta && isFieldNeedsToInclude(name, includeColumns));

    const tableGenerated = ejs.render(editForm, {
      SchemaNameGenerator,
      changeCase,
      chunks,
      entityName,
      fields,
      mutationText,
      pluralize,
      queryEntityText,
      screenName: screenName || tableName,
      table,
      tableName,
      tableSelectors,
    });

    return formatCode(tableGenerated);
  };
