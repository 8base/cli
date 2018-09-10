import * as _ from "lodash";
import { GraphqlActions } from "../../../common";
import { Context } from "../../../common/Context";
import { UserDataStorage } from "../../../common/userDataStorage";
import * as yargs from "yargs";
import { waitForAnswer } from "../../../common/prompt";

export default {
  name: "config",
  handler: async (params: any, context: Context) => {

    const accounts = UserDataStorage.getValue("accounts");
    if (!_.isArray(accounts) || _.isEmpty(accounts)) {
      throw new Error("You should login.");
    }

    let data = {
      workspace: params.w
    };

    const schema: any = {
      properties: {}
    };

    if (!params.w) {
      schema.properties["workspace"] = {
        message: "choose workspace",
      };
    }

    if (Object.keys(schema.properties).length > 0) {
      data = await waitForAnswer<{ workspace: string }>(schema);
    }

  },
  describe: 'Advanced configuation',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage("8base config [OPTIONS]")
      .option("workspace", {
        alias: 'w',
        describe: "select workspace",
        type: "string"
      })
      // .option("show", {
      //   alias: 's',
      //   describe: "show advanced configuration",
      // })
      .help()
      .version(false);
  }
};