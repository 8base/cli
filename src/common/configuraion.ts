import { Context } from "./context";

export class Configuration {

  public static expectConfigured(context: Context) {
    if (!context.hasWorkspaceConfig()) {
      throw new Error(context.i18n.t('configuration_required'))
    }
  }
}
