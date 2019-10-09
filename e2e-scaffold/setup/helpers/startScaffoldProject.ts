import * as execa from "execa";
import { stopScaffoldProject } from "./stopScaffoldProject";

export const startScaffoldProject = async () => {
  try {
    await stopScaffoldProject();

    const npmStart = execa("npm", ["run", "start", "--prefix=./temp/app-example"], { detached: true, stdio: "ignore" });
    npmStart.unref();

    await new Promise((resolve) => {
      setTimeout(() => resolve(), 20000);
    });
  } catch(err) {
    console.log(err);
  }
};

