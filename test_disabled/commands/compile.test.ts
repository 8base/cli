import { ExecutionConfig, StaticConfig, setTraceLevel, TraceLevel, debug } from "../../common";
import { CommandController, BaseCommand } from "../../engine";
import { InvalidArgument } from "../../errors";
import { getFileProvider } from "../../engine";

import * as path from "path";
import * as _ from "lodash";
import * as fs from "fs";

jest.mock("fs");
jest.mock("../../engine/compilers/tsCompiler");

describe("compile 8base project", () => {

    beforeAll(() => {
        fs.writeFileSync("/8base.yml", `
        functions:
            hello:
                handler:
                    code: src/hello.ts
                type: resolver
                schema: src/hello.graphql

            hello2:
                handler:
                    code: src/hello2.js
                type: resolver
                schema: src/hello2.graphql`);

        fs.writeFileSync("/package.json", `{
        "name": "[PROJECT_NAME]",
        "version": "1.0.0",
        "description": "8base Custom Logic"
        }`);

        fs.mkdirSync("/src");

        fs.writeFileSync("/src/hello.graphql", `
        type HelloResult {
            message: String!
        }
        extend type Query {
            hello(name: String): HelloResult
        }
        `);

        fs.writeFileSync("/src/hello.ts", `export default async event => {
            return {
              data: {
                message: "Hello " + event.data.name
              }
            };
          };
        `);

        fs.writeFileSync("/src/hello2.graphql", `
          extend type Query {
            hello2(name: String): HelloResult
          }
          `);

        fs.writeFileSync("/src/hello2.js", `export default async event => {
            return {
              data: {
                message: "Hello " + event.data.name
              }
            };
          };
        `);

        fs.writeFileSync("/wrapper.js", `wrapper test`);
        fs.writeFileSync("/handler.js", `handler test`);

    });

    test("check call compile command command line", async () => {
        const cmd = await CommandController.initialize(new ExecutionConfig(["compile", "-a"]));
        expect(cmd).toBeDefined;

        const resPath = await CommandController.run(cmd);

        const buildDir = fs.readdirSync("/.build");
        expect(buildDir.length).toBe(5);
        expect(buildDir).toContain('compiled');
        expect(buildDir).toContain('dist');
        expect(buildDir).toContain('summary');
        expect(buildDir).toContain('build.zip');
        expect(buildDir).toContain('summary.zip');

        const summaryDir = fs.readdirSync("/.build/summary");
        expect(summaryDir.length).toBe(2);
        expect(summaryDir).toContain('schema.graphql');
        expect(summaryDir).toContain('__summary__functions.json');
    });
});
