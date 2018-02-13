export default async event => {
  return {
      message: `Hello ${event.data.name}`
  };
};
