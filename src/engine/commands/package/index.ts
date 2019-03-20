import { BuildController } from "../../controllers/buildController";
import * as yargs from "yargs";
import * as fs from "fs-extra";
import * as path from "path";
import { Context } from "../../../common/context";
import { translations } from "../../../common/translations";

export default {
  command: "package",
  handler: async (params: any, context: Context) => {
    context.spinner.start(context.i18n.t("package_progress"));

    context.initializeProject();

    const { build, meta } = await BuildController.package(context);

    build.pipe(fs.createWriteStream(path.join(context.config.packageDir, "build.zip")));
    meta.pipe(fs.createWriteStream(path.join(context.config.packageDir, "meta.zip")));

    context.logger.debug(`package directory ${context.config.packageFolder}`);
  },
  describe: translations.i18n.t("package_describe"),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args.usage(translations.i18n.t("package_usage"));
  }
};
