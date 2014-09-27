var { isArray } = Array;
var { keys }    = Object;

export function each(obj) {
  return (isArray(obj) ? obj.keys() : keys(obj)).map(name => [ obj[name], name ]).values();
}
