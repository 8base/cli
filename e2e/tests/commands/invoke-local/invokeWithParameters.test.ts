import {
  addFileToProject,
  addResolverToProject, RunCommand,
  expectInString,
  prepareTestEnvironment
} from "../../../utils";

let project: any = null;
const repositoryName = "test_rep";

it("As a user, I can invoke resolver locally.", async () => {

  jest.setTimeout(12000);

  expect.assertions(1);

  const funcName = "invokeFuncTest";

  const funcCode = `
    import * as path from "path";
    export default async (event: any) => {
      return {
        data: event.data.value
      };
    };
    `;

  const gqlData = `
  extend type Mutation {
    ${funcName}: String
  }`;

  addResolverToProject(funcName, funcCode, gqlData, project.repPath);

  const fileData = JSON.stringify({ data: { value: "kokoko" } });
  const { relativePathToFile } = addFileToProject("someData.json", fileData, project.repPath, "data");

  const result = await RunCommand.invokeLocal(funcName, project.repPath, { path: relativePathToFile });

  expectInString(result, `Result:
    {
      "data": "kokoko"
    }
    invoke-local done. Time:`
  );
});

beforeAll(async () => {
  project = await prepareTestEnvironment(repositoryName);
});

afterAll(() => {
  if (project) {
    project.onComplete();
  }
});
