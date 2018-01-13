import { ExecutionConfig, StaticConfig } from "../../common";
import { CommandManager, BaseCommand } from "../../engine";
import { InvalidArgument } from "../../errors/invalidArgument";
import { getFileProvider } from "../../engine";

import * as fs from "fs";
import * as readdir from "readdir";
import * as path from "path";
import * as _ from "lodash";


describe("install 8base template repository", () => {

  test("check correct parse command line", async () => {
    try {
      expect(CommandManager.initialize(new ExecutionConfig([]))).toThrow(InvalidArgument);
    } catch (er) {
      expect(er).toBeInstanceOf(InvalidArgument);
    }

    try {
      expect(CommandManager.initialize(new ExecutionConfig(["init"]))).toThrow(InvalidArgument);
    } catch (er) {
      expect(er).toBeInstanceOf(InvalidArgument);
    }
  });

  test("check correct instance init command", async () => {
      const cmd = CommandManager.initialize(new ExecutionConfig(["init", "-r", "testrepname"]));
      expect(cmd).toBeInstanceOf(BaseCommand);
  });

  test("check receive template repository", async () => {
    const files = await getFileProvider().provide();
    expect(files.size).toBeGreaterThan(0);
  });

  test("check install template repository", async () => {
    const fs = require("memfs");
    const repName = "ololorepa";
    const cmd = CommandManager.initialize(new ExecutionConfig(["init", "-r", repName], { fs: true }));
    const resPath = await CommandManager.run(cmd);

    expect(resPath).toBe(path.join("/", repName));

    const files = await getFileProvider().provide();

    files.forEach((value:string, name:string) => {
      expect(fs.existsSync(path.join(resPath, name))).toBe(true);
    });
  });
});
