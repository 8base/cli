export default async (event: any) => {
  return {
    data: {
      message: `Hello ${event.data.name}`
    }
  };
};
