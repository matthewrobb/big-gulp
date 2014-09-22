var path      = require("path"),
    minimatch = require("minimatch"),
    traceur   = require("traceur");

var cwd = new RegExp("^(" + (path.dirname(module.filename) + path.sep).replace(/\\/g, "\\\\") + ")", "i");

traceur.require.makeDefault(function(filename) {
    if(cwd.test(filename)) {
        return minimatch(filename.replace(cwd, ""), "lib/**/*.js");
    }
});

module.exports = require("./lib/tasks");
