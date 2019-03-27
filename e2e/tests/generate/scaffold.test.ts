import * as execa from "execa";

import { runner } from "../../runner";

const TEST_APP = "test_app";

beforeEach(async () => {
  await execa.shell(`rm -rf ${TEST_APP}`);
});

it("As a user, I can use help flag for see help information for `generate scaffold` command.", async () => {
  const { stdout } = await runner()("generate", "scaffold", "--help");

  expect(stdout).toMatchSnapshot();
});


it("As a user, I can create some tables.", async () => {
  await runner()("generate", "app", TEST_APP);

  const { stdout: a } = await execa.shell(`pwd`, { cwd: "/Users/ej9x/workspace/cli/test_app"});
  console.log(a);

  const { stdout } = await execa("node", ["/Users/ej9x/workspace/cli", "generate", "scaffold", "Posts"], { cwd: "/Users/ej9x/workspace/cli/test_app" });
  expect(stdout).toMatchSnapshot();

  const { stdout: ls } = await execa.shell(`find ${TEST_APP}/src/routes -mindepth 0 -maxdepth 5 | sort`);
  expect(ls.split("\n").sort()).toMatchSnapshot();

  const { stdout: rootJs } = await execa.shell(`cat ${TEST_APP}/src/Root.js`);
  expect(rootJs).toMatchSnapshot();

  await execa.shell(`rm -rf ${TEST_APP}`);
});

