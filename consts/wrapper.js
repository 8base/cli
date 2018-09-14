const handler = require('./handler');

module.exports.handler = (event, context, callback) => {
    return handler(
        event,
        context,
        callback,
        "__functionname__",
        {
           remoteAddress: "__remote_server_endpoint__"
        }
    );
};