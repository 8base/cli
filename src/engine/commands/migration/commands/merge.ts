import * as yargs from 'yargs';
import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { DeployModeType } from "../../../../interfaces/Extensions";
import { executeAsync, executeDeploy } from "../../../../common/execute";
import { GraphqlAsyncActions } from "../../../../consts/GraphqlActions";
import { ProjectConfigurationState } from "../../../../common/configuraion";

export default {
  command: 'merge',

  handler: async (params: any, context: Context) => {
    ProjectConfigurationState.expectConfigured(context);
    context.spinner.start(context.i18n.t('migration_merge_in_progress'));
    await executeAsync(context, GraphqlAsyncActions.merge, { environmentId: context.workspaceConfig.environment.id })
    context.spinner.stop();
  },

  describe: translations.i18n.t('project_info_describe')
};
