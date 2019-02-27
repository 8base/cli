import * as yargs from "yargs";
import * as fs from "fs-extra";
import * as changeCase from "change-case";
import * as _ from "lodash";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { Interactive } from "../../../common/interactive";

const pluralize = require("pluralize");
const generators = require("@8base/generators");
const { exportTables } = require("@8base/api-client");
const { createQueryColumnsList } = require("@8base/utils");


type ViewCommanConfig = {
  table: "index" | "table" | "create" | "edit" | "crud",
  template: string,
  withMeta: boolean,
  depth: number,
};

type CreateFileConfig = {
  includeColumns ?: string[],
} & ViewCommanConfig;


const promptColumns = async (columns: string[], context: Context): Promise<string[]> => {
  const result = await Interactive.ask({
    name: "columns",
    type: "multiselect",
    message: "choose columns",
    choices: columns.map(column => {
      return {
        title: column,
        value: column,
      };
    })
  });

  return result.columns;
};


const getColumnsNames = (params: ViewCommanConfig, tables: Object[], context: Context): string[] => {
  const table = tables.find(({ name }: any) => params.table === name);

  if (!table) { throw new Error(context.i18n.t("view_table_error", { tableName: params.table })); }

  const columns = createQueryColumnsList(
    tables,
    params.table,
    { deep: params.depth, withMeta: params.withMeta }
  );

  const columnsNames = params.template === "create" || params.template === "edit"
    ? _.uniq(
      columns.map(({ name }: any) => name.split(".")[0])
    )
    : columns.map(({ name }: any) => name);

  return columnsNames;
};


const createTemplateFile = async (
  tables: Object[],
  { table: tableName, template, depth, withMeta, includeColumns }: CreateFileConfig,
  context: Context,
) => {
  let templateString = "";
  let fileName = "";

  switch (template) {
    case "index": {
      templateString = generators.generateIndex(tableName, { deep: depth });
      fileName = `index.js`;
      break;
    }
    case "table": {
      templateString = generators.generateTable(tables, tableName, { deep: depth, withMeta, includeColumns });
      fileName = `${changeCase.pascal(tableName)}Table.js`;
      break;
    }
    case "create": {
      templateString = generators.generateCreateForm(tables, tableName, { deep: depth, includeColumns });
      fileName = `${changeCase.pascal(pluralize.singular(tableName))}CreateDialog.js`;
      break;
    }
    case "edit": {
      templateString = generators.generateEditForm(tables, tableName, { deep: depth, includeColumns });
      fileName = `${changeCase.pascal(pluralize.singular(tableName))}EditDialog.js`;
      break;
    }
    case "delete": {
      templateString = generators.generateDeleteForm(tables, tableName, { deep: depth, includeColumns });
      fileName = `${changeCase.pascal(pluralize.singular(tableName))}DeleteDialog.js`;
      break;
    }
    default: return;
  }

  try {
    await fs.writeFile(fileName, templateString);
    context.logger.info(context.i18n.t("view_successfully_created", { fileName}));
  } catch( err ) {
    context.logger.error(context.i18n.t("view_was_not_created", { fileName }));
  }
};



export default {
  name: "codegen:view",
  describe: translations.i18n.t("view_describe"),
  handler: async (params: ViewCommanConfig, context: Context) => {
    const tables: any[] = await exportTables(context.request.bind(context), { withSystemTables: true });
    const columnsNames = getColumnsNames(params, tables, context);
    const includeColumns = params.template !== "index"
      ? await promptColumns(columnsNames, context)
      : [];

    const generatorConfig = {
      table: params.table,
      depth: params.depth,
      withMeta: params.withMeta,
      includeColumns: includeColumns || [],
    };

    if (params.template === "crud") {
      await createTemplateFile(tables, { ...generatorConfig, template: "index" }, context);
      await createTemplateFile(tables, { ...generatorConfig, template: "create" }, context);
      await createTemplateFile(tables, { ...generatorConfig, template: "edit" }, context);
      await createTemplateFile(tables, { ...generatorConfig, template: "delete" }, context);
      await createTemplateFile(tables, { ...generatorConfig, template: "table" }, context);
    } else {
      await createTemplateFile(tables, { ...generatorConfig, template: params.template }, context);
    }
  },
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("view_usage"))
      .option("table", {
        describe: translations.i18n.t("view_table_describe"),
        type: "string",
        demandOption: true,
      })
      .option("template", {
        describe: translations.i18n.t("view_template_describe"),
        type: "string",
        default: "crud",
      })
      .option("depth", {
        describe: translations.i18n.t("view_depth_describe"),
        type: "number",
        default: 1,
      })
      .option("withMeta", {
        describe: translations.i18n.t("view_withMeta_describe"),
        type: "boolean",
        default: false,
      });
  }
};
