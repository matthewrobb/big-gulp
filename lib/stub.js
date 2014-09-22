import { basename, dirname, join } from "path";

import { File, PluginError } from "gulp-util";

var through = require("through2");

export default function stub(ext = "stub", content = "\\n") {
  return through.obj(function (file, enc, cb) {

    var { path, contents, cwd, base } = file;

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    try {
      this.push(new File({
        cwd      : cwd,
        base     : base,
        path     : `${path}.${ext}`,
        contents : new Buffer(content)
      }));
    } catch (err) {
      this.emit("error", new PluginError("build-stub", err));
    }

    this.push(file);

    cb();
  });
}
