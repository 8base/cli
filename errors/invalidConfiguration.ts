export class InvalidConfiguration extends Error {

    constructor(name: string, desctiption: string) {
        super();
        this.message = "Invalid configuration file \"" + name + "\" \nDesctiption: " + desctiption;
    }
}