import * as _ from "lodash";
import * as fs from "fs";
import * as path from "path";
import gql from "graphql-tag";

import { translations } from "../../common/translations";
import { Context } from "../../common/context";

const MIGRATIONS_DIR_NAME = "migrations";

const LAST_RUNNED_MIGRATION_QUERY = gql`
  query LastRunnedMigration {
    migrationMetasList(orderBy: [createdAt_DESC]) {
      items {
        id
        name
      }
    }
  }
`;

const MIGRATION_META_CREATE_MUTATION = gql`
  mutation MigrationMetaCreate($data: MigrationMetaCreateInput!) {
    migrationMetaCreate(data: $data) {
      id
    }
  }
`;

const MIGRATION_META_DELETE_MUTATION = gql`
  mutation MigrationMetaDelete($id: ID!) {
    migrationMetaDelete(filter: { id: $id }) {
      success
    }
  }
`;

const TABLE_QUERY = gql`
  query Table($name: String!) {
    table(name: $name) {
      id
      name
      displayName
    }
  }
`;

const TABLE_CREATE_MUTATION = gql`
  mutation TableCreate($data: TableCreateInput!) {
    tableCreate(data: $data) {
      id
    }
  }
`;

const TABLE_UPDATE_MUTATION = gql`
  mutation TableUpdate($data: TableUpdateInput!) {
    tableUpdate(data: $data) {
      id
    }
  }
`;

const TABLE_DELETE_MUTATION = gql`
  mutation TableDelete($data: TableDeleteInput!) {
    tableDelete(data: $data) {
      success
    }
  }
`;

const FIELD_CREATE_MUTATION = gql`
  mutation FieldCreate($data: TableFieldCreateInput!) {
    fieldCreate(data: $data) {
      id
    }
  }
`;

const FIELD_UPDATE_MUTATION = gql`
  mutation FieldUpdate($data: TableFieldUpdateInput!) {
    fieldUpdate(data: $data) {
      id
    }
  }
`;

const FIELD_DELETE_MUTATION = gql`
  mutation FieldDelete($data: TableFieldDeleteInput!) {
    fieldDelete(data: $data) {
      success
    }
  }
`;

const MIGRATION_META_TABLE_DATA = {
  name: "migrationMeta",
  displayName: "Migration Meta",
};

const MIGRATION_TEMPLATE = `'use strict';

module.exports = {
  up: ({ gql, request }) => {
    return Promise.resolve();
  },

  down: ({ gql, request }) => {
    return Promise.resolve();
  },
};`;

type Migration = {
  name: string,
  filename: string,
  up: Function,
  down: Function,
};

type MigrationMeta = {
  id: string,
  name: string,
};

class MigrationController {
  public static async getLastRunnedMigrationMetas(context: Context): Promise<MigrationMeta[]> {
    const lastRunnedMigrationResponse = await context.request(LAST_RUNNED_MIGRATION_QUERY);

    const lastRunnedMigrationMetas: MigrationMeta[] = _.get(lastRunnedMigrationResponse, ["migrationMetasList", "items"], []);

    return lastRunnedMigrationMetas;
  }

  public static async getLastRunnedMigrationName(context: Context): Promise<string> {
    const lastRunnedMigrationResponse = await context.request(LAST_RUNNED_MIGRATION_QUERY);

    const lastRunnedMigrationName: string = _.get(lastRunnedMigrationResponse, ["migrationMetasList", "items", 0, "name"], null);

    return lastRunnedMigrationName;
  }

  public static getMigrations(): Migration[] {
    const MIGRATIONS_PATH = path.resolve(process.cwd(), MIGRATIONS_DIR_NAME);

    const migrationFiles = fs.readdirSync(path.resolve(MIGRATIONS_PATH));

    if (!fs.existsSync(MIGRATIONS_PATH)) {
      throw new Error(translations.i18n.t("migration_dir_is_not_existed"));
    }

    const migrations = migrationFiles.map((filename) => {
      const name = filename.slice(14, -3);
      const migration = require(path.resolve(MIGRATIONS_PATH, filename));

      return { name, filename, ...migration };
    });

    return migrations;
  }

  public static async getPendingMigrations(context: Context): Promise<Migration[]> {
    const migrations = MigrationController.getMigrations();

    const lastRunnedMigrationName = await MigrationController.getLastRunnedMigrationName(context);

    const lastRunnedMigrationIndex = migrations.findIndex(({ name }) => lastRunnedMigrationName === name);

    const pendingMigrations = migrations.slice(lastRunnedMigrationIndex + 1);

    return pendingMigrations;
  }

  public static async getAppliedMigrations(context: Context): Promise<Migration[]> {
    const migrations = MigrationController.getMigrations();

    const lastRunnedMigrationName = await MigrationController.getLastRunnedMigrationName(context);

    const lastRunnedMigrationIndex = migrations.findIndex(({ name }) => lastRunnedMigrationName === name);

    const appliedMigrations = migrations.slice(0, lastRunnedMigrationIndex + 1);

    return appliedMigrations;
  }

  public static async runMigrations(context: Context, migrations: Migration[]): Promise<void> {
    for (const { name, up } of migrations) {
      context.spinner.start(context.i18n.t("schema_migrate_running", { name }));

      await up({
        gql,
        request: context.request.bind(context),
        table: context.request.bind(context, TABLE_QUERY),
        tableCreate: context.request.bind(context, TABLE_CREATE_MUTATION),
        tableUpdate: context.request.bind(context, TABLE_UPDATE_MUTATION),
        tableDelete: context.request.bind(context, TABLE_DELETE_MUTATION),
        fieldCreate: context.request.bind(context, FIELD_CREATE_MUTATION),
        fieldUpdate: context.request.bind(context, FIELD_UPDATE_MUTATION),
        fieldDelete: context.request.bind(context, FIELD_DELETE_MUTATION),
      });

      await context.request(MIGRATION_META_CREATE_MUTATION, { data: { name } });

      context.spinner.stop();
    }
  }

  public static async undoMigration(context: Context, migration: Migration, migrationMeta: MigrationMeta): Promise<void> {
    const { name, down } = migration;

    context.spinner.start(context.i18n.t("schema_migrate_undoing", { name }));

    await down({
      gql,
      request: context.request.bind(context),
      table: context.request.bind(context, TABLE_QUERY),
      tableCreate: context.request.bind(context, TABLE_CREATE_MUTATION),
      tableUpdate: context.request.bind(context, TABLE_UPDATE_MUTATION),
      tableDelete: context.request.bind(context, TABLE_DELETE_MUTATION),
      fieldCreate: context.request.bind(context, FIELD_CREATE_MUTATION),
      fieldUpdate: context.request.bind(context, FIELD_UPDATE_MUTATION),
      fieldDelete: context.request.bind(context, FIELD_DELETE_MUTATION),
    });

    await context.request(MIGRATION_META_DELETE_MUTATION, { id: migrationMeta.id });

    context.spinner.stop();
  }

  public static async undoMigrations(context: Context, undoAmount?: number): Promise<void> {
    const migrations = MigrationController.getMigrations();
    const migrationMetas = await MigrationController.getLastRunnedMigrationMetas(context);

    const undoMigrationMetas = undoAmount ? migrationMetas.slice(0, undoAmount) : migrationMetas;

    for (const migrationMeta of undoMigrationMetas) {
      const migration = migrations.find(({ name }) => name === migrationMeta.name);

      if (migration) {
        await MigrationController.undoMigration(context, migration, migrationMeta);
      }
    }
  }

  public static migrationCreate(context: Context, name: string): void {
    const MIGRATIONS_PATH = path.resolve(process.cwd(), MIGRATIONS_DIR_NAME);

    if (!fs.existsSync(MIGRATIONS_PATH)) {
      fs.mkdirSync(MIGRATIONS_PATH);
    }

    const migrations = MigrationController.getMigrations();

    if (migrations.find((migration) => migration.name === name)) {
      throw new Error(context.i18n.t("migration_name_already_used", { name }));
    }

    fs.writeFileSync(path.resolve(process.cwd(), MIGRATIONS_DIR_NAME, `${Date.now()}-${name}.js`), MIGRATION_TEMPLATE);
  }

  public static async createMigrationMetaTableIfNeeded(context: Context): Promise<void> {
    let table = null;

    try {
      ({ table } = await context.request(TABLE_QUERY, { name: MIGRATION_META_TABLE_DATA.name }));
    } catch (e) {}

    if (!table) {
      const { tableCreate: { id: tableId } } = await context.request(TABLE_CREATE_MUTATION, { data: MIGRATION_META_TABLE_DATA });

      await context.request(FIELD_CREATE_MUTATION, {
        data: {
          tableId,
          name: "name",
          displayName: "Name",
          fieldType: "TEXT",
          fieldTypeAttributes: {
            format: "UNFORMATTED",
            fieldSize: 100,
          },
          isList: false,
          isRequired: true,
          isUnique: true,
        },
      });
    }
  }
}

export { MigrationController };