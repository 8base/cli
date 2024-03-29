import { command } from 'execa';
import stripAnsi from 'strip-ansi';

import { runner } from '../runner';

const TEST_DIR = 'testdir_init';

it.skip('As a user, I can init example project.', async () => {
  let { stdout } = await runner()('init', TEST_DIR, '-w=workspaceId -n=18');

  stdout = stripAnsi(stdout);

  expect(stdout.replace(/Time: [\d,]+ sec\./, 'Time: 100 sec.')).toMatchSnapshot();

  const { stdout: ls } = await command(`ls -1 ${TEST_DIR}/** | sort`, { shell: true });

  expect(ls.split('\n').sort()).toMatchSnapshot();
});

it.skip('As a user, I can init empty project.', async () => {
  let { stdout } = await runner()('init', TEST_DIR, '-w=workspaceId', '-e');

  stdout = stripAnsi(stdout);

  expect(stdout.replace(/Time: [\d,]+ sec\./, 'Time: 100 sec.')).toMatchSnapshot();

  const { stdout: ls } = await command(`ls -1 ${TEST_DIR}/** | sort`, { shell: true });

  expect(ls.split('\n').sort()).toMatchSnapshot();
});

afterEach(async () => {
  await command(`rm -rf ${TEST_DIR}`, { shell: true });
});
