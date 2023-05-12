import yargs from 'yargs';
import { Context } from '../../../common/context';
import { translations } from '../../../common/translations';
import { Interactive } from '../../../common/interactive';
import { DEFAULT_ENVIRONMENT_NAME } from '../../../consts/Environment';
import * as _ from 'lodash';
import { Workspace } from '../../../interfaces/Common';

export default {
  command: 'configure',

  handler: async (params: { workspaceId: string; host: string }, context: Context) => {
    let { workspaceId, host = context.resolveMainServerAddress() } = params;

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

      const workspace = _.find<Workspace>(workspaces, { id: workspaceId });
      if (!workspace) {
        throw new Error(context.i18n.t('workspace_with_id_doesnt_exist', { id: workspaceId }));
      }

      host = workspace.apiHost;
    }

    context.updateWorkspace({
      apiHost: host,
      workspaceId,
      environmentName: DEFAULT_ENVIRONMENT_NAME,
    });
  },

  describe: translations.i18n.t('configure_describe'),

  builder: (args: yargs.Argv): yargs.Argv =>
    args
      .usage(translations.i18n.t('configure_usage'))
      .option('workspaceId', {
        alias: 'w',
        describe: translations.i18n.t('configure_workspace_id_describe'),
        type: 'string',
        requiresArg: true,
      })
      .option('host', {
        describe: translations.i18n.t('configure_workspace_host_describe'),
        type: 'string',
        requiresArg: true,
      }),
};
