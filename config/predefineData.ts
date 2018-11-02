import * as path from 'path';

export class PredefineData {
    projectDir = path.join(__dirname, "../");
    executionDir = process.cwd();
    templatePath = path.join(this.projectDir, "../template");
    commandsPath = path.join(this.projectDir, "./engine/commands");
    functionWrapperPath = path.join(this.projectDir, "./consts/wrapper.js");
    remoteAddress = "https://api.8base.com";

    webClientAddress = "https://app.8base.com";

}