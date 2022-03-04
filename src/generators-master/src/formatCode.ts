
import * as prettierBabylon from 'prettier/parser-babylon';
import * as prettier from 'prettier/standalone';

export const formatCode = (code: string) => prettier.format(code, {
  parser: 'babel',
  plugins: [prettierBabylon],
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'es5',
});
