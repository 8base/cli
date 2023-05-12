import * as execa from 'execa';

export const stopScaffoldProject = async () => {
  try {
    const { stdout: pidPrevStdout } = await execa('lsof', ['-i:3000', '-t']);

    if (!!pidPrevStdout) {
      for (const pid of pidPrevStdout.split('\n')) {
        await execa('kill', ['-9', pid]);
      }
    }
  } catch (err) {}
};
