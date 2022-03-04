import * as changeCase from 'change-case';
import * as ejs from 'ejs';
import { formatCode } from '../../formatCode';
import { IScreenTable } from '../../types';
import { chunks } from '../chunks';

// @ts-ignore
import root from './root.js.ejs';

export const generateRoot = (screens: IScreenTable[]) => {
  const rootGenerated = ejs.render(root, {
    changeCase,
    chunks,
    screens,
  });

  return formatCode(rootGenerated);
};
