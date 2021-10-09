// DT173G moment 5, Av Alice Fagerberg HT21

//hämtar gulp-paket med valda huvudfunktioner
const {src, dest, parallel, series, watch} = require('gulp');

//Variabler med paket
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));

//sökvägar
const files = {
    htmlPath: "src/**/*.html",
    sassPath: "src/sass/*.scss",
    jsPath: "src/js/*.js"
}

//HTML task kopiera till pub
function copyHTML() {
    return src(files.htmlPath)
    .pipe(dest('pub'));
}


//sass task
function sassTask() {
    return src(files.sassPath)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest('pub/css')
    );
}

//js-task kopierar till pub
function jsTask() {
    return src(files.jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/js'));   
}


//watch task - lyssnar efter förändringar i filer och kör task-funktioner på nytt
function watchTask() {
    //skapa webbserver med autoreload
    browserSync.init({
        server: "./pub"
    });

    watch([files.htmlPath, files.sassPath, files.jsPath], parallel(copyHTML, sassTask, jsTask)).on('change', browserSync.reload);
}

//exporterar taskfunktioner med metoder
exports.default = series(
    parallel(copyHTML, sassTask, jsTask),
    watchTask
);