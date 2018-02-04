const fs = require("memfs");
fs.copyFileSync = (source, dest) => {
    fs.writeFileSync(dest, fs.readFileSync(source));
};
module.exports  = fs;