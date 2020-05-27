import * as yargs from 'yargs';
import chalk from 'chalk';

import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { StorageParameters } from '../../../../consts/StorageParameters';

export default {
  command: 'info',

  handler: async (params: any, context: Context) => {
    const { workspaceId, environment } = context.workspaceConfig;

    const workspaces = await context.getWorkspaces();

    const workspace = workspaces.find(({ id }: any) => id === workspaceId);

    if (!workspace) {
      throw new Error(translations.i18n.t('project_info_cant_find_workspace', { workspaceId }));
    }

    const endpoint = context.storage.getValue(StorageParameters.serverAddress);

    context.logger.info(
      translations.i18n.t('project_info_text', {
        workspaceId: chalk.green(workspaceId),
        workspaceName: chalk.green(workspace.name),
        environmentName: chalk.green(environment.name),
        endpoint: chalk.green(`${endpoint}/${workspaceId}`),
      }),
    );
  },

  describe: translations.i18n.t('project_info_describe'),

  builder: (args: yargs.Argv): yargs.Argv => args.usage(translations.i18n.t('project_info_usage')),
};
