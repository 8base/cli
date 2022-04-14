import { PluginDefinition } from './Plugin';

export interface ProjectConfig {
  functions: Record<string, any>;
  plugins?: PluginDefinition[];
}
