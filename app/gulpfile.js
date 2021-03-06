const {src, dest, series, parallel, watch} = require('gulp')
const notify        = require('gulp-notify')
const source        = require('vinyl-source-stream')
const browserify    = require('browserify')
const babelify      = require('babelify')
const ngAnnotate    = require('browserify-ngannotate')
const browserSync   = require('browser-sync').create()
const rename        = require('gulp-rename')
const templateCache = require('gulp-angular-templatecache')
const uglify        = require('gulp-uglify')
const merge         = require('merge-stream')
const log           = require('fancy-log')

// Where our files are located
const jsFiles   = "src/js/**/*.js"
const viewFiles = "src/js/**/*.html"

const interceptErrors = function(error) {
    const args = Array.prototype.slice.call(arguments)

    // Send error to notification center with gulp-notify
    notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, args)

    log.error(error)
    this.emit('end')
}

function moveFiles() {
    const html = src("./src/index.html")
        .on('error', interceptErrors)
        .pipe(dest('./build/'))

    const icon = src("./src/icon.png")
        .on('error', interceptErrors)
        .pipe(dest('./build/'))

    const css = src("./src/style.css")
        .on('error', interceptErrors)
        .pipe(dest('./build/'))

    return merge(html, icon, css)
}

function buildTemplates() {
    return src(viewFiles)
        .pipe(templateCache({
            standalone: true
        }))
        .on('error', interceptErrors)
        .pipe(rename("app.templates.js"))
        .pipe(dest('./src/js/config/'))
}

function buildJs() {
    return browserify('./src/js/app.js')
        .transform(babelify, {presets: ["@babel/preset-env"]})
        .transform(ngAnnotate)
        .bundle()
        .on('error', interceptErrors)
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('main.js'))
        // Start piping stream to tasks!
        .pipe(dest('./build/'))
}

function liveReload() {
    browserSync.init(['./build/**/**.**'], {
        server: "./build",
        port: 4000,
        notify: false,
        ui: {
            port: 4001
        }
    })

    watch("./src/index.html", moveHtml)
    watch(viewFiles, buildViews)
    watch(jsFiles, buildJs)
}

/*
* Build production ready minified JS/CSS files into dist/ folder.
*/
function dist() {
    const html = src("./build/index.html")
        .pipe(dest('./dist/'))

    const icon = src("./build/icon.png")
        .pipe(dest('./dist/'))

    const css = src("./build/style.css")
        .pipe(dest('./dist/'))

    const js = src("./build/main.js")
        .pipe(uglify())
        .pipe(dest('./dist/'))

    return merge(html, icon, css, js)
}

module.exports = {
    default: series(buildTemplates, parallel(moveFiles, buildJs)),
    dev: series(buildTemplates, parallel(moveFiles, buildJs), liveReload),
    dist: series(buildTemplates, parallel(moveFiles, buildJs), dist),
}