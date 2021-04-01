const { src, dest, watch, series, parallel } = require("gulp");
const pipeline = require("readable-stream").pipeline;
const fileInclude = require("gulp-file-include");
const sourcemaps = require("gulp-sourcemaps");
const csso = require("gulp-csso");
const prefix = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const jsmin = require("gulp-uglify");
const browserSync = require("browser-sync").create();


const html = function () {
    return pipeline(
        src("src/**/*.html"),
        fileInclude({ prefix: "@@" }),
        dest("dist/"),
        browserSync.stream()
    );
}

const styles = function () {
    return pipeline(
        src("src/styles/*.css"),
        sourcemaps.init(),
        csso(),
        prefix(),
        sourcemaps.write("."),
        dest("dist/styles"),
        browserSync.stream()
    );
}

const scripts = function () {
    return pipeline(
        src("src/js/*.js"),
        sourcemaps.init(),
        babel({
            presets: ['@babel/env']
        }),
        jsmin(),
        sourcemaps.write("."),
        dest("dist/js/"),
        browserSync.stream()
    );
}

const server = function (cb) {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        notify: false,
        open: true,
    });
    cb();
}

const observe = function (cb) {
    watch("src/**/*.html", { usePolling: true }, html);
    watch("src/styles/*.css", { usePolling: true }, styles);
    watch("src/js/*.js", { usePolling: true }, scripts);
    cb();
}

exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = parallel(server, observe);