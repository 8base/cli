import { it, expect, afterEach } from 'vitest';

import { execaCommand as command } from 'execa';
import stripAnsi from 'strip-ansi';

import { runner } from '../runner';

const TEST_DIR = 'e2e_tmp_testdir_init';

it('As a user, I can init example project.', async () => {
  let { stdout } = await runner()('init', TEST_DIR, '-w=workspaceId');

  stdout = stripAnsi(stdout);

  expect(stdout.replace(/Time: [\d,]+ sec\./, 'Time: 100 sec.')).toMatchSnapshot();

  const { stdout: ls } = await command(`ls -1 ${TEST_DIR}/** | sort`, { shell: true });

  expect(ls.split('\n').sort()).toMatchSnapshot();
});

it('As a user, I can init empty project.', async () => {
  let { stdout } = await runner()('init', TEST_DIR, '-w=workspaceId', '-e');

  stdout = stripAnsi(stdout);

  expect(stdout.replace(/Time: [\d,]+ sec\./, 'Time: 100 sec.')).toMatchSnapshot();

  const { stdout: ls } = await command(`ls -1 ${TEST_DIR}/** | sort`, { shell: true });

  expect(ls.split('\n').sort()).toMatchSnapshot();
});

afterEach(async () => {
  await command(`rm -rf ${TEST_DIR}`, { shell: true });
});
