import { ICompiler } from '../../interfaces/ICompiler';
import { Context } from '../../common/context';
import { TypescriptCompiler } from './tsCompiler';

export function getCompiler(files: string[], context: Context): ICompiler {
  return new TypescriptCompiler(files, context);
}
