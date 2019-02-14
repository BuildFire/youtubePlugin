const gulp = require('gulp');
const del = require('del');
const minHTML = require('gulp-htmlmin');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const htmlReplace = require('gulp-html-replace');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');
const imagemin = require('gulp-imagemin');
const gulpSequence = require('gulp-sequence');
const minifyInline = require('gulp-minify-inline');

const destinationFolder= releaseFolder();

function releaseFolder() {
    var arr = __dirname.split("/");
    var fldr = arr.pop();
    arr.push(fldr + "_release");
    return arr.join("/");
}

console.log(">> Building to " , destinationFolder);


const cssTasks=[
    {name:"widgetCSS",src:"widget/**/*.css",dest:"/widget"}
    ,{name:"controlContentCSS",src:"control/content/**/*.css",dest:"/control/content"}
    ,{name:"controlDesignCSS",src:"control/design/**/*.css",dest:"/control/design"}
    ,{name:"controlSettingsCSS",src:"control/settings/**/*.css",dest:"/control/settings"}
];

cssTasks.forEach(function(task){
    gulp.task(task.name, function(){
        return gulp.src(task.src,{base: '.'})
            .pipe(minifyCSS())
            .pipe(concat('styles.min.css'))
            .pipe(gulp.dest(destinationFolder + task.dest))
    });
});

const jsTasks=[
    {name:"widgetJS",src:"widget/**/*.js",dest:"/widget"}
    ,{name:"controlContentJS",src:"control/content/**/*.js",dest:"/control/content"}
    ,{name:"controlDesignJS",src:"control/design/**/*.js",dest:"/control/design"}
    ,{name:"controlSettingsJS",src:"control/settings/**/*.js",dest:"/control/settings"}
];


gulp.task('lint', () => {
    return gulp.src(['widget/**/*.js','control/**/*.js'])
        .pipe(eslint({
            "env": {
                "browser": true,
                "es6": true
            },
            "extends": "eslint:recommended",
            "parserOptions": {
                "sourceType": "module"
            },
            "rules": {
                "semi": [
                    "error",
                    "always"
                ],
                "no-console":[
                    "off"
                ]
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

jsTasks.forEach(function(task){
    gulp.task(task.name, function() {
        return gulp.src(task.src,{base: '.'})
            .pipe(uglify())
            .on('error', function (err) { console.log(err.toString()) })
            .pipe(concat('scripts.min.js'))
            .pipe(gulp.dest(destinationFolder + task.dest));

    });

});

gulp.task('clean',function(){
    return del([destinationFolder],{force: true});
});

gulp.task('html', function(){
    return gulp.src(['widget/**/*.html','widget/**/*.htm','control/**/*.html','control/**/*.htm'],{base: '.'})
        .pipe(htmlReplace({
            bundleJSFiles:"scripts.min.js?v=" + (new Date().getTime())
            ,bundleCSSFiles:"styles.min.css?v=" + (new Date().getTime())
        }))
        .pipe(minHTML({removeComments:true,collapseWhitespace:true}))
        .pipe(minifyInline())
        .pipe(gulp.dest(destinationFolder));
});



gulp.task('resources', function(){
    return gulp.src(['resources/*','widget/fonticons/**','plugin.json'],{base: '.'})
        .pipe(gulp.dest(destinationFolder ));
});


gulp.task('images', function(){
    return gulp.src(['**/.images/**','control/design/icons/**','control/design/layouts/**'],{base: '.'})
        .pipe(imagemin())
        .pipe(gulp.dest(destinationFolder ));
});


var buildTasksToRun=['html','resources','images'];

cssTasks.forEach(function(task){  buildTasksToRun.push(task.name)});
jsTasks.forEach(function(task){  buildTasksToRun.push(task.name)});

gulp.task('build', gulpSequence('lint','clean',buildTasksToRun) );