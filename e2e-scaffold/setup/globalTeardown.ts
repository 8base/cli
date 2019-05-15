import { removeScaffoldProject } from "./helpers/removeScaffoldProject";
import { stopScaffoldProject } from "./helpers/stopScaffoldProject";

const {
  E2E_SCAFFOLD_GENERATE,
} = process.env;


export default async () => {
  try {
    await global.__BROWSER__.close();

    if (E2E_SCAFFOLD_GENERATE === "true") {
      await stopScaffoldProject();
      await removeScaffoldProject();
    }
  } catch(err) {
    console.log(err);
  }
};
