import { it, expect, beforeAll, afterAll } from 'vitest';

import {
  addFileToProject,
  addResolverToProject,
  expectInString,
  prepareTestEnvironment,
  RunCommand,
} from '../../../utils';

let project: any;
const repositoryName = 'test_rep';

it('As a user, I can invoke resolver locally.', async () => {
  expect.assertions(1);

  const funcName = 'invokeFuncTest';

  const funcCode = `
    import * as path from 'path';
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

  await addResolverToProject(funcName, funcCode, gqlData, project.repPath);

  const fileData = JSON.stringify({ data: { value: 'kokoko' } });
  const { relativePathToFile } = await addFileToProject('someData.json', fileData, project.repPath, 'data');

  const result = await RunCommand.invokeLocal(funcName, project.repPath, { path: relativePathToFile });

  expectInString(
    result,
    `Result:
    {
      "data": "kokoko"
    }
    invoke-local done. Time:`,
  );
}, { timeout: 12000 });

beforeAll(async () => {
  project = await prepareTestEnvironment(repositoryName);
});

afterAll(() => {
  if (project) {
    project.onComplete();
  }
});
