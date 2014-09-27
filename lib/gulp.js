import _gulp      from "gulp";
import prefixer   from "gulp-autoprefixer";
import less       from "gulp-less";
import filter     from "gulp-filter";
import clean      from "gulp-rimraf";
import sourcemaps from "gulp-sourcemaps";
import changed    from "gulp-changed";

export { prefixer, less, filter, clean, sourcemaps, changed };

export function task(...args) {
  return _gulp.task(...args);
}

export function src(...args) {
  return _gulp.src(...args);
}

export function dest(...args) {
  return _gulp.dest(...args);
}

export function watch(...args) {
  return _gulp.watch(...args);
}
