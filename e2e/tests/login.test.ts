import { runner } from "../runner";

it("As a user, I can use help flag for see help information for `login` command.", async () => {
  const { stdout } = await runner()("login", "--help");

  expect(stdout).toMatchSnapshot();
});

// it("As a user, I can use `login` command for login.", async () => {
//   await runner()("config", "-s=https://prestaging-api.8basedev.com/");

//   const { stdout } = await runner()("login", "-e=zouxuoz-8base+7414205639@yandex.ru", "-p=RsqKchqXqE>dKk9ZQda6");

//   expect(stdout.replace(/Time estimate: \d+ ms\./, "Time estimate: 100 ms.")).toMatchSnapshot();
// });