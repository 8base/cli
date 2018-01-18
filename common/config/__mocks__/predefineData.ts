import * as path from 'path';

export class PredefineData {
    templatePath: string;
    commandsPath: string;

    private definePathToTemplate(): string {
        return path.join(__dirname, "../../../template");
    }

    private defineCommandsPath(): string {
        return path.join(__dirname, "../../../engine/commands");
    }

    constructor() {
        this.templatePath = this.definePathToTemplate();
        this.commandsPath = this.defineCommandsPath();
    }
}