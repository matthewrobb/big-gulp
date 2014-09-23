import path_lib from "path";
var { dirname, sep: path_sep } = path_lib;

import {
  src,
  dest,
  changed,
  prefixer,
  less,
  filter
} from "../gulp";

import bower from "../bower";
import { pipe as jsCompile } from "../js-compile";
import { compile as tplCompile } from "../tpl-compile";
import { define } from "../procs";

define("static/client", (config)=> {
  var cssFilter  = filter("**/*.css"),
    lessFilter = filter("**/*.less"),
    jsFilter   = filter(file =>
      /\.js$/.test(file.path) &&
      (dirname(file.path).split(path_sep).pop() !== "vendor") &&
      !(/jquery|hype|\.min\./gi.test(file.path))
    );

  return src(config.src)
    .pipe(changed(config.dest))

    .pipe(lessFilter)
    .pipe(less())
    .pipe(prefixer("last 2 versions", { cascade: false }))
    .pipe(lessFilter.restore())

    .pipe(cssFilter)
    .pipe(prefixer("last 2 versions", { cascade: false }))
    .pipe(cssFilter.restore())

    .pipe(jsFilter)
    .pipe(jsCompile())
    .pipe(jsFilter.restore())

    .pipe(dest(config.dest));
});

define("static/vendor", (config)=>
  src(config.src)
    .pipe(bower(config.vendor))
    .pipe(changed(config.dest))
    .pipe(dest(config.dest))
);
