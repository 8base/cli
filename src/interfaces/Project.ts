import { ExtensionsContainer } from './Extensions';

export interface ProjectDefinition {
  extensions: ExtensionsContainer;

  name: string;

  gqlSchema: string;
}
