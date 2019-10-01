import { runner } from '../runner';

it.each([
  [['']],
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
  [['plugin']],
  [['plugin', 'install']],
  [['plugin', 'remove']],
])('As a user, I can use help flag for see help information about `%s`.', async (cmd) => {
  const { stdout } = await runner()(...cmd, '--help');

  expect(stdout).toMatchSnapshot();
});
