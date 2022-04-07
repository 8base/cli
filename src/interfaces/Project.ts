import { ExtensionsContainer } from './Extensions';
import { PluginDefinition } from './Plugin';

export interface ProjectDefinition {
  name: string;
  extensions: ExtensionsContainer;
  gqlSchema: string;
}

export interface ProjectConfig {
  readonly functions: Record<string, any>;
  plugins?: PluginDefinition[];
}
