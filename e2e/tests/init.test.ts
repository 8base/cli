import * as fs from 'fs';
import * as execa from 'execa';

import { runner } from '../runner';

const TEST_DIR = 'testdir_init';

it('As a user, I can use help flag for see help information for `init` command.', async () => {
  const { stdout } = await runner()('init', '--help');

  expect(stdout).toMatchSnapshot();
});

it('As a user, I can use help flag for see help information for `init` command.', async () => {
  const { stdout } = await runner()('init', TEST_DIR);

  expect(stdout.replace(/Time: \d+ ms\./, 'Time: 100 ms.')).toMatchSnapshot();

  const { stdout: ls } = await execa.shell(`ls -1 ${TEST_DIR}/** | sort`);

  expect(ls.split("\n").sort()).toMatchSnapshot();
});

afterEach(async () => {
  await execa.shell(`rm -rf ${TEST_DIR}`);
});