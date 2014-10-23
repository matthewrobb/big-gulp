var path      = require("path"),
    minimatch = require("minimatch"),
    traceur   = require("traceur");

var lib = new RegExp("^(" + (path.dirname(module.filename) + path.sep).replace(/\\/g, "\\\\") + ")", "i");

traceur.require.makeDefault(function(filename) {
    if(lib.test(filename)) {
        return minimatch(filename.replace(lib, ""), "lib/**/*.js");
    }
});

module.exports = require("./lib/tasks");

var cwd = new RegExp("^(" + (process.cwd() + path.sep).replace(/\\/g, "\\\\") + ")", "i");
var task_patterns = [];

module.exports.config = config;
function config(options) {
    if(options && options.tasks) {
        task_patterns = task_patterns.concat(options.tasks);
    }
}

traceur.require.makeDefault(function(filename) {
    if(cwd.test(filename)) {
        return task_patterns.some(function(glob) {
            return minimatch(filename.replace(cwd, ""), glob);
        });
    }
});
