import { compileModules as compile_modules } from "../js-compile";
import { define } from "../procs";

/* Script build steps */
define("scripts/server", (config)=> {
  var options = {
    source: config.src,
    output: config.dest
  };

  if(config.options) {
    for(var key of Object.keys(config.options)) {
      options[key] = config.options[key];
    }
  }

  compile_modules(options);
});
