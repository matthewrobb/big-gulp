import path_lib from "path";
var { basename, extname, join } = path_lib;

import gutil from "gulp-util";
import through   from "through2";
import minimatch from "minimatch";


var { keys, assign } = Object;
var { iterator } = Symbol;

class BowerConfig {

  constructor(cfg) {
    assign(this, cfg);
  }

  match(file) {
    var { path, base } = file,
      ext = extname(path),
      name = basename(path).replace(new RegExp(`${ ext }$`), "");

    if(path.indexOf("test") !== -1) {
      return;
    }

    for(var [ id, info ] of this) {
      if(id === path || minimatch(path, `**/${ id }.+(js|map)`)) {
        file.path = join(base, (info.id ? info.id : name) + ext);
        return info;
      }
    }
  }

  *[ iterator ]() {
    for(var key of keys(this)) {
      if(key !== iterator) {
        yield [ key, this[key] ];
      }
    }
  }
}

export default function bower(config) {
  config = new BowerConfig(config);

  return through.obj(function(file, enc, cb) {
    var info;

    if (file.isStream()) {
      this.emit("error", new gutil.PluginError("bower", "Streaming not supported"));
      return cb();
    }

    if (file.isNull() || file.isDirectory() || !(info = config.match(file))) {
      return cb();
    }

    this.push(file);

    cb();
  });
}
