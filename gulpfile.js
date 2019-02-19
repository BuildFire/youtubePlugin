const gulp = require("gulp");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const del = require("del");
const babel = require("gulp-babel");
const minHTML = require("gulp-htmlmin");
const minifyCSS = require("gulp-csso");
const concat = require("gulp-concat");
const htmlReplace = require("gulp-html-replace");
const uglify = require("gulp-uglify");
const eslint = require("gulp-eslint");
const imagemin = require("gulp-imagemin");
const gulpSequence = require("gulp-sequence");
const minifyInline = require("gulp-minify-inline");

const destinationFolder = releaseFolder();

function releaseFolder() {
  var arr = __dirname.split("/");
  var fldr = arr.pop();
  arr.push(fldr + "_release");
  return arr.join("/");
}

console.log(">> Building to ", destinationFolder);

const templatesSource = [
  "widget/**/*.html",
  "widget/**/*.htm",
  "control/**/*.html",
  "control/**/*.htm"
];

const cssTasks = [
  { name: "widgetCSS", src: "widget/**/*.css", dest: "/widget" },
  {
    name: "controlContentCSS",
    src: "control/content/**/*.css",
    dest: "/control/content"
  },
  {
    name: "controlDesignCSS",
    src: "control/design/**/*.css",
    dest: "/control/design"
  },
  {
    name: "controlSettingsCSS",
    src: "control/settings/**/*.css",
    dest: "/control/settings"
  }
];

cssTasks.forEach(function(task) {
  gulp.task(task.name, function() {
    return gulp
      .src(task.src, { base: "." })
      .pipe(
        plumber({
          errorHandler: function(err) {
            notify.onError({
              title: "Gulp error in " + err.plugin,
              message: err.toString()
            })(err);
          }
        })
      )
      .pipe(minifyCSS())
      .pipe(concat("styles.min.css"))
      .pipe(gulp.dest(destinationFolder + task.dest));
  });
});

const jsTasks = [
  { name: "widgetJS", src: "widget/**/*.js", dest: "/widget" },
  {
    name: "controlContentJS",
    src: "control/content/**/*.js",
    dest: "/control/content"
  },
  {
    name: "controlDesignJS",
    src: "control/design/**/*.js",
    dest: "/control/design"
  },
  {
    name: "controlSettingsJS",
    src: "control/settings/**/*.js",
    dest: "/control/settings"
  }
];

gulp.task("lint", () => {
  const stream = gulp
    .src(["widget/**/*.js", "control/**/*.js"])
    .pipe(
      plumber({
        errorHandler: function(err) {
          notify.onError({
            title: "Gulp error in " + err.plugin,
            message: err.toString()
          })(err);
        }
      })
    )
    .pipe(
      eslint({
        env: {
          browser: true,
          es6: true
        },
        extends: "eslint:recommended",
        parserOptions: {
          sourceType: "module"
        },
        rules: {
          semi: ["error", "always"],
          "no-console": ["off"]
        }
      })
    )
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
  return stream;
});

jsTasks.forEach(function(task) {
  gulp.task(task.name, function() {
    return gulp
      .src(task.src, { base: "." })
      .pipe(
        plumber({
          errorHandler: function(err) {
            notify.onError({
              title: "Gulp error in " + err.plugin,
              message: err.toString()
            })(err);
          }
        })
      )
      .pipe(
        babel({
          presets: ["@babel/env"]
        })
      )
      .pipe(uglify())
      .pipe(concat("scripts.min.js"))
      .pipe(gulp.dest(destinationFolder + task.dest));
  });
});

gulp.task("clean", function() {
  return del([destinationFolder], { force: true });
});

gulp.task("html", function() {
  return gulp
    .src(templatesSource, { base: "." })
    .pipe(
      plumber({
        errorHandler: function(err) {
          notify.onError({
            title: "Gulp error in " + err.plugin,
            message: err.toString()
          })(err);
        }
      })
    )
    .pipe(
      htmlReplace({
        bundleJSFiles: {
          src: "scripts.min.js?v=" + new Date().getTime(),
          tpl: '<script src="%s"></script>'
        },
        bundleCSSFiles: "styles.min.css?v=" + new Date().getTime()
      })
    )
    .pipe(minHTML({ removeComments: true, collapseWhitespace: true }))
    .pipe(minifyInline())
    .pipe(gulp.dest(destinationFolder));
});

gulp.task("resources", function() {
  return gulp
    .src(["resources/*", "widget/fonticons/**", "plugin.json"], { base: "." })
    .pipe(
      plumber({
        errorHandler: function(err) {
          notify.onError({
            title: "Gulp error in " + err.plugin,
            message: err.toString()
          })(err);
        }
      })
    )
    .pipe(gulp.dest(destinationFolder));
});

gulp.task("images", function() {
  return gulp
    .src(
      ["**/.images/**", "control/design/icons/**", "control/design/layouts/**"],
      { base: "." }
    )
    .pipe(
      plumber({
        errorHandler: function(err) {
          notify.onError({
            title: "Gulp error in " + err.plugin,
            message: err.toString()
          })(err);
        }
      })
    )
    .pipe(imagemin())
    .pipe(gulp.dest(destinationFolder));
});

// collect the html templates and populate the angular $template cache
gulp.task("cache-templates", function() {
  gulp
    .src(templatesSource)
    .pipe(
      html2js({
        outputModuleName: "templates",
        useStrict: true,
        base: "src/"
      })
    )
    .pipe(concat("templates.js"))
    .pipe(gulp.dest("dist"));
});

var buildTasksToRun = ["html", "resources", "images"];

cssTasks.forEach(function(task) {
  buildTasksToRun.push(task.name);
});
jsTasks.forEach(function(task) {
  buildTasksToRun.push(task.name);
});

gulp.task("build", gulpSequence("lint", "clean", buildTasksToRun));
