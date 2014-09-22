var { isArray } = Array;
var { keys }    = Object;

export function each(obj) {
  return (isArray(obj) ? obj.keys() : keys(obj)).map(name => [ obj[name], name ]).values();
}

export function traverse(obj, fn) {
  if(typeof obj !== "object") return;

  function visit(val, key, ctx) {
    if( Array.isArray(val) ){
      val.forEach(visit);
    } else if( typeof val === "object" ){
      fn(val, key, ctx);
      trav(val, fn);
    }
  }

  for(var key in obj) {
    visit(obj[key], key, obj);
  }
}
