var gulp = require("gulp");
var sass = require('gulp-sass');
var ftp = require("gulp-ftp");
var imagemin = require("gulp-imagemin");
var pngquant = require('imagemin-pngquant');
var csso = require("gulp-csso");
var autoprefixer = require('gulp-autoprefixer');
var path = require("path");
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');


path = [
    "index.html",
    "./src/**/*.css",
    "./src/**/*.scss",
    "./src/img/min/",//path[3]
    "./src/js/",
    "./src/img/dest/min/",
    "./src/**/*.jade",
    "./dest/**/*.html"
];

var spritesmith = require('gulp.spritesmith');


gulp.task('min',function(){
    gulp.src(path[3] + '*')
        .pipe(imagemin({
            progressive:true,
            svgoPlugins: [{removeViewBox:false}],
            use:[pngquant()]
        }))
        .pipe(gulp.dest('./src/asset/img/min/'));
});


var browser = require("browser-sync");
gulp.task("server",function(){
    browser({
        server:{
            baseDir: "./"
        },
        url: {
            port: 3001
        },
        port: 8080
    });
});

var rubySass = require("gulp-ruby-sass");
var sourcemaps = require("gulp-sourcemaps");
gulp.task('scss',function(){
    //1.0.0から配列やアスタリスクは使えない
    return rubySass(['./src/app/index.scss','./src/static/index.scss'],{
        style: 'expanded',
        sourcemap: true
    })
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(plumber())
        .pipe(gulp.dest('./dest/'))
        .pipe(browser.reload({stream:true,open: false}))
        .pipe(notify({ message: 'Styles task complete'}))
});


var jade = require('gulp-jade');
gulp.task('jade', function(){
    return gulp.src(['./src/static/*.jade', '!./src/**/_*.jade'])
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./'))
});
gulp.task('html',function(){
    gulp.src(path[0])
        .pipe(browser.reload({stream:true,open: false}))
})

gulp.task("default",['server'], function() {
    gulp.watch(path[6],["jade"]);
    gulp.watch(path[0],["html"]);
    gulp.watch(path[2],["scss"]);
});

