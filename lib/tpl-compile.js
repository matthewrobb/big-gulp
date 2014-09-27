import path_lib from "path";
var {basename, dirname, join} = path_lib;

import gutil from "gulp-util";
var {File, PluginError} = gutil;

import through from "through2";

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

    try {
      var { filename, content } = process(contents.toString(), basename(path), dirname(path), base);

      file.path = filename;
      file.contents = new Buffer(content);
    } catch (err) {
      this.emit("error", new PluginError("build-templates", err));
    }

    this.push(file);

    cb();
  });
}
