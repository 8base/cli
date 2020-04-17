import * as yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { DeployModeType } from "../../../../interfaces/Extensions";
import { executeDeploy } from "../../../../common/execute";
import { GraphqlActions } from "../../../../consts/GraphqlActions";
import { ConfigurationState } from "../../../../common/configuraion";

export default {
  command: 'apply',

  handler: async (params: any, context: Context) => {

    const { immediately, sourceId, targetId } = params;

    ConfigurationState.expectConfigured(context);

    if (immediately) {
      await context.request(GraphqlActions.migrationImmediately, { sourceId, targetId })
      return ;
    }

    ConfigurationState.expectHasProject(context);

    context.spinner.start(context.i18n.t('migration_deploy_in_progress', { status: 'prepare to upload' }));
    context.initializeProject();
    await executeDeploy(context, { mode: DeployModeType.migrations });
    context.spinner.stop();

    context.spinner.start(context.i18n.t('migration_apply_in_progress'));

    context.spinner.stop();
  },

  describe: translations.i18n.t('project_info_describe'),

  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("clone_usage"))
      .option("immediately", {
        alias: "i",
        describe: translations.i18n.t("migration_plan_source_id_describe"),
        type: "boolean",
        default: false
      })
      .option("sourceId", {
        alias: "s",
        describe: translations.i18n.t("migration_plan_source_id_describe"),
        type: "string",
      })
      .option("targetId", {
        alias: "t",
        describe: translations.i18n.t("migration_plan_target_id_describe"),
        type: "string",
      })
  }
};
