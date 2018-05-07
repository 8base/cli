module.exports = async event => {
  return event && event.data ? {
    message: `Hello ${event.data.name}`
  } : {
    message: "Hello world!"
  };
};
  