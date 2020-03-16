import { ICompiler } from '../../interfaces/ICompiler';
import { TypescriptCompiler } from './tsCompiler';
import { Context } from '../../common/context';

export function getCompiler(files: string[], context: Context): ICompiler {
  return new TypescriptCompiler(files, context);
}
