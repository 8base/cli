import * as _ from "lodash";
import { Context } from "../../../common/Context";
import * as yargs from "yargs";
import { Interactive } from "../../../common/interactive";
import { StorageParameters } from "../../../consts/StorageParameters";


type workspace = { name: string, account: string };

const promptWorkspace = async (accounts: workspace[]): Promise<workspace> => {
  return (await Interactive.ask({
    name: "workspace",
    type: "select",
    message: "choose workspace",
    choices: accounts.map(account => { return {
      title: account.name,
      value: account.account
    }; })
  })).workspace;
};

const promptServer = async (context: Context): Promise<workspace> => {
  return (await Interactive.ask({
    name: "server",
    type: "text",
    message: "Server address:",
    initial: context.storage.user.getValue(StorageParameters.serverAddress) || context.storage.static.remoteAddress
  })).server;
};

const selectWorkspace = async (accounts: any[], params: any): Promise<workspace> => {
  if (_.isEmpty(accounts)) {
    return null;
  }

  const workspaceId = params.w ? params.w : await promptWorkspace(accounts);

  const activeWorkspace = accounts.find(account => account.account === workspaceId);
  if (!activeWorkspace) {
    throw new Error("Workspace " + workspaceId + " is absent");
  }
  return activeWorkspace;
};

export default {
  name: "config",
  handler: async (params: any, context: Context) => {

    const accounts = context.storage.user.getValue(StorageParameters.workspaces);

    const server = params.s ? params.s : await promptServer(context);

    context.storage.user.setValues([
      {
        name: StorageParameters.activeWorkspace,
        value: await selectWorkspace(accounts, params)
      },
      {
        name: StorageParameters.serverAddress,
        value: server
      }
    ]);
  },

  describe: 'Advanced configuation',

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage("8base config [OPTIONS]")
      .option("workspace", {
        alias: 'w',
        describe: "workspace id",
        type: "string"
      })
      .option("server", {
        alias: 's',
        describe: "server address",
        type: "string"
      })
      .help()
      .version(false);
  }
};