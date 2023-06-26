import execa from 'execa';
import { stopScaffoldProject } from './stopScaffoldProject';
import { Utils } from '../../../src/common/utils';

export const startScaffoldProject = async () => {
  try {
    await stopScaffoldProject();

    const npmStart = execa('npm', ['run', 'start', '--prefix=./temp/app-example'], {
      detached: true,
      stdio: 'ignore',
    });
    npmStart.unref();

    await Utils.sleep(20000);
  } catch (err) {
    console.log(err);
  }
};
