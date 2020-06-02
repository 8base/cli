import { Context } from "./context";

export class ProjectConfigurationState {

  public static expectConfigured(context: Context) {
    if (!context.hasWorkspaceConfig() || !context.workspaceConfig.workspaceId || !context.workspaceConfig.environment) {
      throw new Error(context.i18n.t('configuration_required'))
    }
  }

  public static expectHasProject(context: Context) {
    ProjectConfigurationState.expectConfigured(context);
    if (!context.hasProjectConfig()) {
      throw new Error(context.i18n.t('you_are_not_in_project'))
    }
  }
}
