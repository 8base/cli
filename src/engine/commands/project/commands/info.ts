import yargs from 'yargs';
import chalk from 'chalk';

import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { Workspace } from '../../../../interfaces/Common';
import { ProjectConfigurationState } from '../../../../common/configuraion';
import { StaticConfig } from '../../../../config';

export default {
  command: 'info',

  handler: async (params: {}, context: Context) => {
    await ProjectConfigurationState.expectConfigured(context);

    const { workspaceId, environmentName } = context.workspaceConfig;

    const workspace = (await resolveWorkspace(context, workspaceId)) || {
      apiHost: StaticConfig.apiAddress,
      id: workspaceId,
      name: '',
    };

    context.logger.info(
      translations.i18n.t('project_info_text', {
        workspaceId: chalk.green(workspaceId),
        workspaceName: chalk.green(workspace.name),
        environment: chalk.green(environmentName),
        endpoint: chalk.green(`${workspace.apiHost}/${workspaceId}`),
      }),
    );
  },

  describe: translations.i18n.t('project_info_describe'),

  builder: (args: yargs.Argv): yargs.Argv => args.usage(translations.i18n.t('project_info_usage')),
};

const resolveWorkspace = async (context: Context, workspaceId: string): Promise<Workspace | null> => {
  try {
    return (await context.getWorkspaces()).find(({ id }: any) => id === workspaceId);
  } catch (e) {
    // in case of api token user could not resolve workspace list.
  }

  return null;
};
