import { runner } from "../runner";

it("As a user, I can use help flag for see help information about commands.", async () => {
  const { stdout } = await runner()("--help");

  expect(stdout).toMatchSnapshot();
});
