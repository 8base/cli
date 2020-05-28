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
    context.initializeProject();
    await executeDeploy(context, { mode: DeployModeType.migrations });
  },

  describe: translations.i18n.t('migration_deploy_describe'),
};
