import { StaticConfig, trace } from "../../../../common";
import * as path from "path";
import * as fs from "fs";
import * as readdir from "readdir";

interface IFileProvider {
    /*async*/ provide(): Promise<Map<string, string>>;
}

class StaticFileProvider implements IFileProvider {
    private pathToTemplate = path.join(StaticConfig.commandsDir, "init/template");

    async provide(): Promise<Map<string, string>> {
        return new Map<string, string>([["olo", "koko"], ["gfgf/fgfgf", "olololo"]]);
    }
}

export function getFileProvider(): IFileProvider {
    return new StaticFileProvider();
}