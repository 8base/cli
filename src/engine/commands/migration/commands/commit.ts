import { Context } from '../../../../common/context';
import { translations } from '../../../../common/translations';
import { executeAsync, executeDeploy } from "../../../../common/execute";
import { GraphqlAsyncActions } from "../../../../consts/GraphqlActions";
import { ProjectConfigurationState } from "../../../../common/configuraion";
import { DeployModeType } from "../../../../interfaces/Extensions";

export default {
  command: 'commit',
  handler: async (params: any, context: Context) => {
    ProjectConfigurationState.expectHasProject(context);
    context.initializeProject();
    await executeDeploy(context, { mode: DeployModeType.migrations });

    context.spinner.start(context.i18n.t('migration_commit_in_progress'));
    await executeAsync(context, GraphqlAsyncActions.commit, { environmentId: context.workspaceConfig.environment.id })
  },
  describe: translations.i18n.t('migration_commit_describe'),
};
