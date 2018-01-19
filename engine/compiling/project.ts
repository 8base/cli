
import { StaticConfig, debug } from "../../common";
import * as path from "path";
import * as fs from "fs";
import * as yaml from "js-yaml";
import { ProjectDefinition } from "./definitions";


export class CompilingProject {

    private pathToYmlConfig = path.join(StaticConfig.rootProjectDir, "./8base.yml");

    private definitions: ProjectDefinition;

    async initialize() {
        if (!fs.existsSync(this.pathToYmlConfig)) {
            return Promise.reject("invalid directory");
        }

        const json = yaml.safeLoad(this.pathToYmlConfig) as ProjectDefinition;
        debug(json.service);
    }
}