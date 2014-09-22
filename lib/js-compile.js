var path   = require('path');
var fs     = require("fs");

var glob   = require('glob');
var mkdirp = require("mkdirp");
var gutil = require('gulp-util');
var through = require('through2');

var recast           = require("recast");
var esprima          = require('esprima-fb');
var recast           = require('recast');
var ResolverFactory  = require('es6-module-transpiler-resolver-factory');
var esnext           = require('esnext');
var defs             = require('defs');

var transpiler      = require('es6-module-transpiler');
var SystemFormatter = require('es6-module-transpiler-system-formatter');
var CjsFormatter    = transpiler.formatters.commonjs;
var Container       = transpiler.Container;

function es6blockbinding(ast, options) {
  options || (options = {});
  options.ast = true;

  ast = defs(ast.program, options);

  if (ast.errors) {
    throw new Error(ast.errors.join("\n"));
  }

  return { type: "File", program: ast.ast };
}

export function compile(source, filename) {
  var ast = transform(parse(source, filename));
  return recast.print(ast, {
    sourceMapName: path.basename(filename)
  });
}

export function parse(source, filename) {
  return recast.parse(source, {
    esprima: esprima,
    sourceFileName: filename,
    range: true,
    loc: true
  });
}

export function transform(ast) {
  ast = es6blockbinding(ast, {
    disallowUnknownReferences: false,
    disallowDuplicated: false,
    disallowVars: false,
    loopClosures: "iife"
  });

  ast = esnext.transform(ast);

  return ast;
}

var Resolver = ResolverFactory.extend({
  fetch: function(resolvedPath, load) {
    if(load.module = load.container.getCachedModule(resolvedPath)) {
      return false;
    }

    return resolvedPath && fs.existsSync(resolvedPath) ? fs.readFileSync(resolvedPath): new Buffer("export default function(){}");
  },
  translate(source, load) {
    var ast = parse(source, path.basename(load.resolvedPath));
    return transform(ast);
  }
});

function writeModule(file, filename) {
  var sourceMapFilename = filename + '.map';

  var rendered = recast.print(file, {
    sourceMapName: path.basename(filename)
  });

  var code = rendered.code;

  mkdirp.sync(path.dirname(filename));

  var currentVersion = fs.existsSync(filename) && fs.readFileSync(filename, "utf8").toString();

  if (rendered.map) {
    code += '\n\n//# sourceMappingURL=' + path.basename(sourceMapFilename);

    rendered.map.sourceRoot = "/source/";

    fs.writeFileSync(
      sourceMapFilename,
      JSON.stringify(rendered.map, null, 4),
      { encoding: 'utf8' }
    );
  }

  if (code !== currentVersion) {
    fs.writeFileSync(filename, code, { encoding: 'utf8' });
  }
}

export function compileModules({ source, output, modules }) {
  var src_path  = path.resolve(process.cwd(), source),
    out_path  = path.resolve(process.cwd(), output || source),
    Formatter = (modules !== false && (modules === "cjs" && CjsFormatter)) || SystemFormatter;

  glob("**/*.js", { cwd : src_path }, function(err, files) {

    if (!files.length) {
      return;
    }

    var container = new Container({
      resolvers : [ new Resolver([ src_path ]) ],
      formatter : new Formatter()
    });

    files.forEach(function(file) {
      (/\.less\.js$/.test(file)) || container.getModule(file);
    });

    container.convert().forEach(function(mod) {
      writeModule(mod, path.join(out_path, mod.filename));
    });
  });
}

export function pipe() {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-js-compile', 'Streaming not supported'));
      return cb();
    }

    try {
      var res = compile(file.contents.toString(), file.path);

      file.contents = new Buffer(res.code);

      if (res.map) {
        this.push(new gutil.File({
          cwd: file.cwd,
          base: file.base,
          path: file.path + '.map',
          contents: new Buffer(res.map)
        }));
      }
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-js-compile', err, {fileName: file.path}));
    }

    this.push(file);
    cb();
  });
}
