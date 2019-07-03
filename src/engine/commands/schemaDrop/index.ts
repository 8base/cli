import * as yargs from "yargs";
import gql from "graphql-tag";

import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";
import { Interactive } from "../../../common/interactive";

const USER_TABLES_LIST_QUERY = gql`
  query UserTablesList {
    tablesList(filter:{ onlyUserTables: true }) {
      items {
        id
        name
      }
    }
  }
`;

const TABLE_DELETE_MUTATION = gql`
  mutation TableDelete($id: ID!) {
    tableDelete(data: { id: $id }) {
      success
    }
  }
`;

export default {
  command: "schema:drop",
  handler: async (params: any, context: Context) => {
    let confirm = params.confirm;

    if (!confirm) {
      ({ confirm } = await Interactive.ask({
        name: "confirm",
        type: "confirm",
        message: translations.i18n.t("schema_drop_confirm"),
        initial: false,
      }));
    }

    if (confirm) {
      const { tablesList: { items: userTablesList } } = await context.request(USER_TABLES_LIST_QUERY);

      for (const { id, name } of userTablesList) {
        context.spinner.start("Deleting table " +  name + "\n");

        await context.request(TABLE_DELETE_MUTATION, { id });

        context.spinner.stop();
      }
    }
  },

  describe: translations.i18n.t("schema_drop_describe"),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t("schema_drop_usage"))
      .option("confirm", {
        alias: "c",
        describe: "confirm",
        type: "boolean",
        demand: false
      })
};
