const fs = require("memfs");
fs.copyFileSync = (source: string, dest: string) => {
    fs.writeFileSync(dest, fs.readFileSync(source));
};
module.exports  = fs;