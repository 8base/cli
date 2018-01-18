
const defaultGlobbyOptions = {
    dot: true,
    silent: true,
    follow: true,
    nosort: true,
    mark: true
  };

export async function provideFilesToCompile(): Promise<any> {
    // return globby(['**/*', '!.build', '!*.zip', '!build'], defaultGlobbyOptions);
}