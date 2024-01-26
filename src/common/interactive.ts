import prompts from 'prompts';

export type InteractiveInput = {
  name: string;
  message?: string;
  initial?: string | boolean;
  choices?: any[];
  type: 'select' | 'password' | 'text' | 'multiselect' | 'confirm';
};

export namespace Interactive {
  export const ask = (options: InteractiveInput): Promise<any> => {
    return prompts(options);
  };
}
