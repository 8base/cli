export class InvalidConfiguration extends Error {
  constructor(name: string, description: string) {
    super();
    this.message = 'Invalid configuration file "' + name + '". Description: ' + description;
  }
}
