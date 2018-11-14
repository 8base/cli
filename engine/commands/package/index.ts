import { Utils } from "../../../common/utils";
import { BuildController } from "../../controllers/buildController";
import * as yargs from "yargs";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";

export default {
  name: "package",
  handler: async (params: any, context: Context) => {
    context.spinner.start(context.i18n.t("package_progress"));

    const buildDir = await BuildController.package(context);
    context.logger.debug(`build dir ${JSON.stringify(buildDir, null, 2)}`);
  },
  describe: translations.i18n.t("package_describe"),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args.usage(translations.i18n.t("package_usage"));
  }
};
