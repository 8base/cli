import * as yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { DeployModeType } from "../../../../interfaces/Extensions";
import { executeDeploy } from "../../../../common/execute";
import { ProjectConfigurationState } from "../../../../common/configuraion";

export default {
  command: 'deploy',

  handler: async (params: any, context: Context) => {
    ProjectConfigurationState.expectHasProject(context);
    context.spinner.start(context.i18n.t('migration_deploy_in_progress', { status: 'prepare to upload' }));
    context.initializeProject();
    await executeDeploy(context, { mode: DeployModeType.migrations });
    context.spinner.stop();
  },

  describe: translations.i18n.t('project_info_describe'),
};
