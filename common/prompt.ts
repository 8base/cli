const prompt = require("prompt");
prompt.message = "";
prompt.colors = false;

export const waitForAnswer = <Result_T>(schema: any) => {
  return new Promise<Result_T>((resolve, reject) => {
    const res = prompt.start();
    prompt.get(schema, (err: Error, result: any) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};
