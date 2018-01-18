import { provideFilesToCompile } from "./provideFilesToCompile";
import * as path from 'path'
import { trace, debug, StaticConfig } from "../../common";
import * as globby from "globby";

export async function compile() {
    const files = await provideFilesToCompile();

    debug(files);
}


export async function checkCompilingDirectory() {
    const requiredFiles = ["8base.yml"];
    debug(await globby(["**/*", '!.build', '!*.zip', '!build']));
    //StaticConfig.rootProjectDir
}

//const debug = require('debug')('ts-builder')

