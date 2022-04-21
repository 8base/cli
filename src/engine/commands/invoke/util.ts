import * as fs from 'fs';
import { Context } from '../../../common/context';
import { ProjectController } from '../../controllers/projectController';

export const resolveInvocationArgs = (context: Context, params: InvokeParams): string | undefined => {
  const { name, mock, 'data-path': dataPath, 'data-json': dataJson } = params;

  if (mock) {
    return ProjectController.getMock(context, name, mock);
  } else if (dataPath) {
    return fs.readFileSync(dataPath).toString();
  } else if (dataJson) {
    return dataJson;
  }
};

export type InvokeParams = {
  name: string;
  'data-json'?: string;
  'data-path'?: string;
  mock?: string;
};
