module.exports = async event => {
    return {
      message: `Hello ${event.data.name}`
    };
  };
  