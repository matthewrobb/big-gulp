import {
  src,
  dest,
  changed,
  prefixer,
  less,
  filter,
  sourcemaps
} from "../gulp";

import { define }                from "../procs";
import { compile as tplCompile } from "../tpl-compile";
import { compileModules }        from "../js-compile";
import stub                      from "../stub";

define("app/transpile", (config)=> {
  compileModules({ cwd: config.cwd, source : config.src, output: config.dest });
});

define("app/scripts", (config)=>
  src(config.src)
    .pipe(changed(config.dest))
    .pipe(dest(config.dest))
);

define("app/templates", (config)=> 
  src(config.src)
    .pipe(tplCompile(config.compile))
    .pipe(dest(config.dest))
);

define("app/less", (config)=> {
  var lessFilter = filter("**/*.less");

  return src(config.src)
    .pipe(stub("js", "/**/"))
    .pipe(lessFilter)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(less())
    .pipe(prefixer("last 2 versions", { cascade: false }))
    .pipe(sourcemaps.write("./", { sourceRoot: "/source/" }))
    .pipe(lessFilter.restore())
    .pipe(dest(config.dest));
});

define("app/static", (config)=> 
  src(config.src)
    .pipe(dest(config.dest))
);
