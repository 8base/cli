const prompts = require("prompts");

export type InteractiveInput = {
  name: string,
  message?: string,
  initial?: string,
  choices?: any[]
  type: "select" | "password" | "text" | "multiselect"
};

export namespace Interactive {

  export const ask = (options: InteractiveInput): Promise<any> => {
    return prompts(options);
  };
}
