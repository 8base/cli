import * as path from 'path';

export class PredefineData {
    templatePath = path.join(__dirname, "../../../template");
    commandsPath = path.join(__dirname, "../../../engine/commands");
    projectDir = path.join(__dirname, "../../");
    executionDir = "/";
    functionHandlerPath = "/handler.js";
    functionWrapperPath = "/wrapper.js";
}