export default async (event: any) => {
  return event && event.data ? {
      message: `Hello ${event.data.name}`
  } : {
    message: "Hello world!"
  };
};
