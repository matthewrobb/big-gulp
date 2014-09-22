import {basename, dirname, join} from "path";
import {File, PluginError} from "gulp-util";
import {traverse} from "./util";

var through = require("through2");

export function compile(process) {

  return through.obj(function (file, enc, cb) {

    var { path, contents, cwd, base } = file;

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit("error", new PluginError("gulp-templates", "Streaming not supported"));
      return cb();
    }

    var dest, template;

    try {
      [ dest, template ] = process(contents.toString(), basename(path), dirname(path), base);

      file.path = dest;
      file.contents = new Buffer(template);
    } catch (err) {
      this.emit("error", new PluginError("build-templates", err));
    }

    this.push(file);

    cb();
  });
}
