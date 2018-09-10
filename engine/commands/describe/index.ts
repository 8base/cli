import * as yargs from "yargs";
import { Context } from "../../../common/Context";

// export class RelativeWebhookDefinition {
//   constructor(options: {
//       name: string,
//       httpMethod: string,
//       accountRelativePath: string;
//       appId: string
//   }) {
//       this.name = options.name;
//       this.appId = options.appId;
//       this.accountRelativePath = options.accountRelativePath;
//       this.httpMethod = options.httpMethod;
//       this.resolvedPath = url.resolve(UserDataStorage.getValue("remoteAddress"), this.accountRelativePath);
//   }

//   name: string;
//   httpMethod: string;

//   get resolvedHttpMethod(): string {
//       return this.httpMethod.toUpperCase() === "ANY" ? "POST" : this.httpMethod;
//   }

//   accountRelativePath: string;
//   appId: string;
//   resolvedPath: string;

// }

export default {
  name: "describe",
  handler: async (params: any, context: Context) => {

    // const result = await ServerConnector().describeBuild();

    // if (this.functions || this.allPrint) {
    //     trace("Functions: ");
    //     trace(JSON.stringify(result.functions, null, 2));
    //     trace("");
    // }

    // if (this.webhooks || this.allPrint) {
    //     trace("Webhooks: ");
    //     trace(JSON.stringify(result.webhooks, null, 2));
    //     trace("");
    // }

    // if (this.triggers || this.allPrint) {
    //     trace("Triggers: ");
    //     trace(JSON.stringify(result.triggers, null, 2));
    // }
  },
  describe: 'Describe project',
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage("8base describe [OPTIONS]")
      .help()
      .version(false);
  }
};
