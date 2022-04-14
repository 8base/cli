import { ExtensionsContainer } from './Extensions';
import { PluginProject } from './Plugin';

export interface ProjectDefinition {
  readonly name: string;
  readonly extensions: ExtensionsContainer;
  readonly gqlSchema: string;
  readonly plugins: PluginProject[];
}
