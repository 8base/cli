module.exports = function handler(event, ctx, cb, funcname) {
  try {
    const funcObject = require(funcname);
    let func;
    let res;
    if (typeof(funcObject) === 'function' ) {
        func = funcObject;
    } else  if (funcObject.default && typeof(funcObject.default) === 'function' ) {
        func = funcObject.default;
    } else {
      throw new Error("invalid function format");
    }
    
    Promise.resolve(func(event))
      .then(res => cb(null, res))
      .catch(ex => cb(ex));
  } catch(ex) {
    cb(ex);
  }
}
