import * as execa from 'execa';
import stripAnsi from 'strip-ansi';

import { runner } from '../runner';

const TEST_DIR = 'testdir_init';

it('As a user, I can init example project.', async () => {
  let { stdout } = await runner()('init', TEST_DIR, '-w=workspaceId');

  stdout = stripAnsi(stdout);

  expect(stdout.replace(/Started: .+\. Elapsed: [\d,]+ sec\./, 'Started: 100. Elapsed: 100 sec.')).toMatchSnapshot();

  const { stdout: ls } = await execa.shell(`ls -1 ${TEST_DIR}/** | sort`);

  expect(ls.split('\n').sort()).toMatchSnapshot();
});

it('As a user, I can init empty project.', async () => {
  let { stdout } = await runner()('init', TEST_DIR, '-w=workspaceId', '-e');

  stdout = stripAnsi(stdout);

  expect(stdout.replace(/Started: .+\. Elapsed: [\d,]+ sec\./, 'Started: 100. Elapsed: 100 sec.')).toMatchSnapshot();

  const { stdout: ls } = await execa.shell(`ls -1 ${TEST_DIR}/** | sort`);

  expect(ls.split('\n').sort()).toMatchSnapshot();
});

afterEach(async () => {
  await execa.shell(`rm -rf ${TEST_DIR}`);
});
