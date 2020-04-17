import * as _ from 'lodash';
import * as yargs from 'yargs';

import { Context } from '../../../common/context';
import { translations } from '../../../common/translations';
import { ProjectController } from '../../controllers/projectController';
import { Interactive } from '../../../common/interactive';

export default {
  command: 'configure',

  handler: async (params: any, context: Context) => {
    let { workspaceId, environmentName } = params;

    if (!workspaceId) {
      const workspaces = await context.getWorkspaces();

      ({ workspaceId } = await Interactive.ask({
        name: 'workspaceId',
        type: 'select',
        message: translations.i18n.t('configure_select_workspace'),
        choices: workspaces.map((workspace: any) => ({
          title: workspace.name,
          value: workspace.id,
        })),
      }));

      if (!workspaceId) {
        throw new Error(translations.i18n.t('configure_prevent_select_workspace'));
      }
    }

    context.updateWorkspaceConfig({ workspaceId, environmentName });

    if (!environmentName) {
      const environments = await context.getEnvironments(workspaceId);
      ({ environmentName } = await Interactive.ask({
        name: "environmentName",
        type:"select",
        message: translations.i18n.t("configure_select_environment"),
        choices: environments.map(e => ({ title: e.name, value: e.name }))
      }));

      if (!environmentName) {
        throw new Error(translations.i18n.t("configure_prevent_select_environment"));
      }
    }
  },

  describe: translations.i18n.t('configure_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('configure_usage'))
      .option('workspaceId', {
      alias: 'w',
      describe: translations.i18n.t('configure_workspace_id_describe'),
      type: 'string',
    })
      .option('environmentName', {
        alias: 'e',
        describe: translations.i18n.t('configure_environment_name_describe'),
        type: 'string',
      }),
};
