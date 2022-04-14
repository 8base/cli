import { ExtensionsContainer } from './Extensions';
import { ProjectSettings } from './ProjectSettings';

export interface PluginDefinition {
  readonly name: string;
  readonly path: string;
}

export interface PluginProject {
  readonly name: string;
  readonly extensions: ExtensionsContainer;
  readonly gqlSchema: string;
  readonly settings?: ProjectSettings;
}
