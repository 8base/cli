import { Context } from "./context";

export class ConfigurationState {

  public static expectConfigured(context: Context) {
    if (!context.hasWorkspaceConfig()) {
      throw new Error(context.i18n.t('configuration_required'))
    }
  }

  public static expectHasProject(context: Context) {
    ConfigurationState.expectConfigured(context);
    if (!context.hasProjectConfig()) {
      throw new Error(context.i18n.t('you_are_not_in_project'))
    }
  }
}
