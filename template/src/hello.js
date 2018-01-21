module.exports.hello_eug = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'kokoko!!!',
      input: event,
    }),
  };

  callback(null, response);
};
