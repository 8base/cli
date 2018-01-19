import { provideFilesToCompile } from "./provideFilesToCompile";
import * as path from 'path';
import { trace, debug, StaticConfig } from "../../common";
import { CompilingProject } from "./project";
// const debug = require('debug')('ts-builder')

export { CompilingProject } from "./project";

export async function compile() {
    const files = await provideFilesToCompile();

    debug(files);
}

const defaultGlobbyOptions = {
    dot: true,
    silent: true,
    follow: true,
    nosort: true,
    mark: true
  };

export async function initializeCompilingProject(): Promise<CompilingProject> {
    let project = new CompilingProject();
    await project.initialize();
    return project;
}



