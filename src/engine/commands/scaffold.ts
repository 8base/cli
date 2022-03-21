import * as yargs from 'yargs';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import { Context } from '../../common/context';
import { translations } from '../../common/translations';
import { Interactive } from '../../common/interactive';
import { writeFs } from '../../common/memfs';
import { createQueryColumnsList, TableSchema } from '@8base/utils';
import { exportTables } from '@8base/api-client';

type ViewCommandConfig = {
  tableName: string;
  depth: number;
  all: boolean;
};

type Screen = {
  tableId: string;
  screenName?: string;
  tableFields?: string[];
  formFields?: string[];
};

type EightBaseConfig = {
  appName: string;
};

const promptColumns = async (
  columns: string[],
  message: string,
): Promise<string[]> => {
  const result = await Interactive.ask({
    name: 'columns',
    type: 'multiselect',
    message: message,
    choices: columns.map((column) => {
      return {
        title: column,
        value: column,
      };
    }),
  });

  return result.columns;
};

const getTable = (tables: TableSchema[], tableName: string): TableSchema => {
  const table = tables.find(
    ({ name, displayName }) =>
      tableName.toLowerCase() === name.toLowerCase() ||
      tableName.toLowerCase() === displayName.toLowerCase(),
  );

  if (!table) {
    throw new Error(
      translations.i18n.t('generate_scaffold_table_error', { tableName }),
    );
  }

  return table;
};

const getColumnsNames = (
  params: { withMeta: boolean } & ViewCommandConfig,
  tables: TableSchema[],
): string[] => {
  const { name } = getTable(tables, params.tableName);
  const table = getTable(tables, name);

  const columns = createQueryColumnsList(tables, table.id, {
    deep: params.depth,
    withMeta: params.withMeta,
  });

  const columnsNames = columns.map(({ name }) => name);

  return columnsNames;
};

const createTemplateFs = async (
  tables: TableSchema[],
  screen: Screen,
  config: { depth: number },
  context: Context,
) => {
  const rootFile = await fs.readFile('src/Root.js', 'utf8');

  /*  const fsObject = generateScreen(
        {
            tablesList: tables,
            screen,
            rootFile,
        },
        {deep: config.depth},
    );

    try {
        if (fs.existsSync(Object.keys(fsObject)[0])) {
            throw new Error(translations.i18n.t('generate_scaffold_crud_exist_error'));
        }

        await writeFs(fsObject);

        Object.keys(fsObject).forEach(filePath => context.logger.info(filePath));
        context.logger.info(context.i18n.t('generate_scaffold_successfully_created', {screenName: screen.screenName}));
    } catch (err) {
        context.logger.error(err);
        context.logger.error(context.i18n.t('generate_scaffold_was_not_created', {screenName: screen.screenName}));
    } */
};

export default {
  command: 'scaffold [tableName]',
  describe: translations.i18n.t('generate_scaffold_describe'),
  handler: async (params: ViewCommandConfig, context: Context) => {
    context.spinner.start('Fetching table data');
    const tables: TableSchema[] = (
      await exportTables(context.request.bind(context), {
        withSystemTables: true,
      })
    ).filter((table) => !table.isSystem);
    console.log('DAtaa', tables);
    // List tables
    if (!params.tableName) {
      context.spinner.stop();
      context.logger.info(`
      TABLES:
        ${tables.map((table) => `${table.displayName} \n`)}
      `);
      process.exit();
    }

    const { name, id } = getTable(tables, params.tableName);

    context.spinner.stop();

    let tableFields, formFields;

    if (!params.all) {
      const columnsTableNames = getColumnsNames(
        { ...params, withMeta: true },
        tables,
      );
      tableFields =
        (await promptColumns(columnsTableNames, 'Choose table fields')) || [];

      const columnsFormNames = getColumnsNames(
        { ...params, withMeta: false, depth: 1 },
        tables,
      );
      formFields =
        (await promptColumns(columnsFormNames, 'Choose form fields')) || [];
    }

    const generatorScreen = {
      tableId: id,
      screenName: name,
      formFields: formFields,
      tableFields: tableFields,
    };

    const generatorConfig = {
      depth: params.depth,
    };

    await createTemplateFs(tables, generatorScreen, generatorConfig, context);
  },
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t('generate_scaffold_usage'))
      .option('depth', {
        describe: translations.i18n.t('generate_scaffold_depth_describe'),
        type: 'number',
        default: 1,
      })
      .option('all', {
        type: 'boolean',
        default: false,
        hidden: true,
      });
  },
};
