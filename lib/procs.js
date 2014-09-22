import traverse from "traverse";
import minimatch from "minimatch";
import StreamQueue from "streamqueue";

class ProcList extends Array {

  contains(path) {
    return this.some(proc => proc.path === path);
  }

  push(proc) {
    return !this.contains(proc.path) && super.push(proc);
  }

  call(...args) {
    // Had to gimp how this works due to errors, will figure it out at some point
    return this[0](...args);
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
