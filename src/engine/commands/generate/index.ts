import * as yargs from "yargs";
import { translations } from "../../../common/translations";

export default {
  command: "generate <command>",
  describe: translations.i18n.t("generate_describe"),
  builder: function (yargs: yargs.Argv) {
    return yargs.commandDir("commands", {
      extensions: ["js", "ts"],
    });
  },
  handler: function () {
    // This is parent handler. It is not used.
  }
};
