
export class InvalidArgument extends Error {

    constructor(name: string) {
        super();
        this.message = "Invalid parameter \"" + name + "\" ";
    }
}