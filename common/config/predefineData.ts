import { StaticConfig } from "../../common";
import * as path from 'path';

export class PredefineData {
    templatePath: string;
    commandsPath: string;

    private definePathToTemplate(): string {
        return path.join(StaticConfig.rootProjectDir, "./template");
    }

    private defineCommandsPath(): string {
        return path.join(StaticConfig.rootProjectDir, "./engine/commands");
    }

    constructor() {
        this.templatePath = this.definePathToTemplate();
        this.commandsPath = this.defineCommandsPath();
    }
}