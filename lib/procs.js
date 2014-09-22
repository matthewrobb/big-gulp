import traverse from "traverse";
import minimatch from "minimatch";

class ProcList extends Array {

  contains(path) {
    return this.some(proc => proc.path === path);
  }

  push(proc) {
    return !this.contains(proc.path) && super.push(proc);
  }

  call(...args) {
    for(var proc of this) proc(...args);
  }

  wrap(...xargs) {
    return (...args)=> this.call(...xargs, ...args);
  }

  filter(selector) {
    return ProcList.from(super.filter(proc => minimatch(proc.path, selector)))
  }

  static from(src) {
    var dest = new ProcList();
    for(var proc of src) dest.push(proc);
    return dest;
  }
}

var procs = new ProcList();

export function define(path, proc) {
  proc.path = path;
  procs.push(proc);
}

export function call(path) {
  procs.filter(path).call();
}

export function wrap(selector, ...args) {
  return procs.filter(selector).wrap(...args);
}
