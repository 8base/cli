import * as yargs from 'yargs';
import { Context } from '../../../common/context';
import { translations } from '../../../common/translations';
import { Interactive } from '../../../common/interactive';
import { DEFAULT_ENVIRONMENT_NAME } from "../../../consts/Environment";

export default {
  command: 'configure',

  handler: async (params: any, context: Context) => {
    let { workspaceId } = params;

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

    context.updateWorkspaceConfig({ workspaceId, environment: null });
    context.updateWorkspaceConfig({ environment: await context.getDefaultEnvironment(workspaceId) });
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
};
