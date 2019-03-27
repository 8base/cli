import * as execa from "execa";

import { runner } from "../../runner";

const TEST_APP = "test_app";

beforeEach(async () => {
  await execa.shell(`rm -rf ${TEST_APP}`);
});

it("As a user, I can use help flag for see help information for `generate app` command.", async () => {
  const { stdout } = await runner()("generate", "app", "--help");

  expect(stdout).toMatchSnapshot();
});


it("As a user, I can generate new app.", async () => {
  const { stdout } = await runner()("generate", "app", TEST_APP);
  expect(stdout).toMatchSnapshot();

  const { stdout: ls } = await execa.shell(`find ${TEST_APP} -mindepth 0 -maxdepth 5 | sort`);
  expect(ls.split("\n").sort()).toMatchSnapshot();

  const { stdout: applicationJs } = await execa.shell(`cat ${TEST_APP}/src/Application.js`);
  expect(applicationJs).toMatchSnapshot();

  const { stdout: baseYml } = await execa.shell(`cat ${TEST_APP}/.8base.yml`);
  expect(baseYml).toMatchSnapshot();
  await execa.shell(`rm -rf ${TEST_APP}`);
});
