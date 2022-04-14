import { runner } from '../runner';

it.each([
  [['']],
  [['backup']],
  [['backup', 'create']],
  [['backup', 'list']],
  [['backup', 'restore']],
  [['configure']],
  [['deploy']],
  [['describe']],
  [['export']],
  [['generate']],
  [['generate', 'app']],
  [['generate', 'scaffold']],
  [['generate', 'resolver']],
  [['generate', 'trigger']],
  [['generate', 'task']],
  [['generate', 'webhook']],
  [['generate', 'mock']],
  [['import']],
  [['init']],
  [['invoke']],
  [['invoke']],
  [['login']],
  [['logout']],
  [['logs']],
  [['package']],
  [['environment']],
  [['environment', 'set']],
  [['environment', 'branch']],
  [['environment', 'list']],
  [['environment', 'show']],
  [['migration']],
  [['migration', 'commit']],
  [['migration', 'generate']],
  [['migration', 'status']],
])('As a user, I can use help flag for see help information about `%s`.', async cmd => {
  expect.assertions(1);

  const { stdout } = await runner()(...cmd, '--help');

  expect(stdout).toMatchSnapshot();
});
