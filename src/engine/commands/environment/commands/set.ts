import * as _ from 'lodash';
import * as yargs from 'yargs';
import { Context } from "../../../../common/context";
import { Interactive } from "../../../../common/interactive";
import { translations } from "../../../../common/translations";
import { ProjectConfigurationState } from "../../../../common/configuraion";

export default {
  command: 'set',

  handler: async (params: any, context: Context) => {
    let { environmentId } = params;
    ProjectConfigurationState.expectConfigured(context);

    context.updateWorkspaceConfig({ environment: null });
    const environments = await context.getEnvironments(context.workspaceConfig.workspaceId);

    if (!environmentId) {
      ({ environmentId } = await Interactive.ask({
        name: "environmentId",
        type:"select",
        message: translations.i18n.t("environment_set_select_environment"),
        choices: environments.map(e => ({ title: e.name, value: e.id }))
      }));

      if (!environmentId) {
        throw new Error(translations.i18n.t("environment_set_prevent_select_environment"));
      }
    }

    const environment = environments.find(env => env.id === environmentId);
    if (!environment) {
      throw new Error(translations.i18n.t("environment_set_prevent_select_environment"));
    }

    context.updateWorkspaceConfig({ environment });
  },

  describe: translations.i18n.t('environment_set_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('environment_set_usage'))
      .option('environmentId', {
        alias: 'e',
        describe: translations.i18n.t('environment_set_environment_name_describe'),
        type: 'string',
      }),
};
