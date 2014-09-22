var path = require("path");
var handlebars = require('handlebars');
var gulp = require("gulp");
var clean = require("gulp-clean");
var changed = require("gulp-changed");
var gt = require("../");

/* Config */
var temp_path = "temp";
var dist_path = "dist";


/* Main */
gulp.task("default", [ "dist" ]);

gulp.task("dist", [ "build" ], function() {
    return gulp.src(temp_path, { read: false }).pipe(clean())
});

gulp.task("build", [ "static", "vendor", "scripts", "app" ], function() {
    return gulp.src(temp_path + "/**/*").pipe(gulp.dest(dist_path));
});

gulp.task("clean", function() {
    return src([ "dist", "temp" ], { read: false }).pipe(clean());
});

gulp.task("clean:deep", function() {
    return src([ "dist", "temp", "node_modules", "vendor" ], { read: false }).pipe(clean());
});


/* Static */
gulp.task("static", gt.wrap("static/client", {
    src: [ "src-client/!(app)/**/*", "src-client/*" ],
    dest: temp_path + "/public"
}));

gulp.task("vendor", gt.wrap("static/vendor", {
    src: ["vendor/**/*.js", "vendor/**/*.map"],
    dest: temp_path + "/public/js/vendor",

    vendor: {
        "jquery.min"              : { id: "jquery.min" },
        "jquery.velocity.min"     : { id: "jquery-velocity" },
        "regenerator/runtime/min" : { id: "regenerator-runtime" },
        "handlebars.runtime.min"  : { id: "handlebars-runtime" },
        "handlebars.min"          : { id: "handlebars-compiler" },
        "backbone"                : { id: "backbone" },
        "underscore"              : { id: "underscore" }
    }
}));


/* Scripts */
gulp.task("scripts:server", gt.wrap("scripts/server", {
    src: "src-server",
    dest: temp_path,
    options: {
        modules: "cjs",
        includeRuntime: true
    }
}));

gulp.task("scripts", [ "scripts:server" ]);


/* Dev */
gulp.task("start", gt.wrap("dev/start", {
    main: "./dist/index.js",
    watch: [ "dist/**/*.js", "!dist/public/**/*" ]
}));

gulp.task("watch", [ "build" ], function() {
    gulp.watch("src-client/app/**/*", [ "app" ]);
    gulp.watch("src-server/**/*", [ "scripts:server" ]);
    gulp.watch([ "src-client/**/*", "!src-client/app/**/*" ], [ "static" ]);
    gulp.watch("vendor/**/*.js", [ "vendor" ]);

    gulp.watch(temp_path + "/**/*", [ "copy" ]);
});

gulp.task("copy", function() {
    return gulp.src([ temp_path + "/**/*", "!**/*.less.js" ])
        .pipe(changed(dist_path))
        .pipe(gulp.dest(dist_path))
});

gulp.task("dev", [ "watch", "start" ]);


/* App */
gulp.task("app", [ "app:transpile", "app:static" ]);

gulp.task("app:transpile", [ "app:templates", "app:less", "app:scripts" ], gt.wrap("app/transpile", {
    src: temp_path + "/public/app"
}));

gulp.task("app:scripts", gt.wrap("app/scripts", {
    src: ["src-client/app/**/*.js"],
    dest: temp_path + "/public/app"
}));

gulp.task("app:templates", gt.wrap("app/templates", {
    src: "src-client/app/**/*.hbs",
    dest: temp_path + "/public/app",

    compile: function (raw, name, dir) {
        return {
            filename: path.join(dir, name + ".js"), 
            content: [
                'import compile from "lib/templates";',
                'export var raw = `' + handlebars.precompile(raw) + '`;',
                'export var template = compile(raw);',
                'export default template;'
            ].join("\n")
        };
    }
}));

gulp.task("app:less", gt.wrap("app/less", {
    src: "src-client/app/**/*.less",
    dest: temp_path + "/public/app"
}));

gulp.task("app:static", gt.wrap("app/static", { 
    src: "src-client/app/**/*.html",
    dest: temp_path + "/public/app"
}));
