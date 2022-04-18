declare module 'tree-node-cli' {
  interface Options {
    allFiles?: boolean;
    dirsFirst?: boolean;
    dirsOnly?: boolean;
    sizes?: boolean;
    exclude?: RegExp[];
    maxDepth?: number;
    reverse?: boolean;
    trailingSlash?: boolean;
    ascii?: boolean;
  }

  function tree(path: string, options?: Options): string;

  export = tree;
}
