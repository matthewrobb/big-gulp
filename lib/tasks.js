import "./tasks/app";
import "./tasks/dev";
import "./tasks/scripts";
import "./tasks/static";

export var paths = (paths)=> Object.keys(paths).reduce((fn, name)=> Object.assign(fn, {
    [name]: fn.bind(null, paths[name])
}), (base, append = "")=> `${base}/${append}`.replace(/(\/+)/g, "/"));

import { define, call, wrap } from "./procs";

export { define, call, wrap };
