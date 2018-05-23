const handler = require('./handler');

const filename = "__functionname__";

module.exports.handler = (event, context, callback) => {
    return handler(
        event,
        context,
        callback,
        filename,
        {
           remoteAddress: "__remote_server_endpoint__"
        }
    );
};