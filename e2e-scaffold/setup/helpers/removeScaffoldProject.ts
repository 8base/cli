import * as execa from 'execa';

export const removeScaffoldProject = async () => {
  try {
    await execa('rm', ['-rf', 'temp']);
  } catch (err) {
    console.log(err);
  }
};
