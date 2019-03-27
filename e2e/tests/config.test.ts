import { runner } from "../runner";

it("As a user, I can use help flag for see help information about `config` commands.", async () => {
  const { stdout } = await runner()("config", "--help");

  expect(stdout).toMatchSnapshot();
});


it("As a user, I can use help flag for see contains of the config.", async () => {
  const { stdout } = await runner()("config", "-v");

  expect(stdout).toMatchSnapshot();
});
