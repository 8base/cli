import { Context } from './context';

export class ProjectConfigurationState {
  public static async expectConfigured(context: Context) {
    if (
      !context.hasWorkspaceConfig() ||
      !context.workspaceConfig.workspaceId ||
      !context.workspaceConfig.environmentName
    ) {
      throw new Error(context.i18n.t('configuration_required'));
    }
  }

  public static async expectHasProject(context: Context) {
    await ProjectConfigurationState.expectConfigured(context);
    if (!context.hasProjectConfig()) {
      throw new Error(context.i18n.t('you_are_not_in_project'));
    }
  }
}
