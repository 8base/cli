// TODO

module.exports = function handler(event, ctx, cb, funcname) {
  try {
    const func = require(`./${funcname}`);
    cb(func(event));
  } catch(ex) {
    
  }
}
