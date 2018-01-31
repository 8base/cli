const handler = require('./handler');

const filename = "__functionname__";

module.exports.handler = (event, context, callback) => {
    return handler(event, context, callback, filename);
};