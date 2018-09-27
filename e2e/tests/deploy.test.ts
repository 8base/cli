import { runner } from '../runner';

it('As a user, I can use help flag for see help information for `deploy` command.', async () => {
  const { stdout } = await runner()('deploy', '--help');

  expect(stdout).toMatchSnapshot();
});