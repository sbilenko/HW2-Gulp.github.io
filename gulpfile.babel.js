'use strict'

import gulp from 'gulp'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass(dartSass)
import cssnano from 'gulp-cssnano'
import rename from 'gulp-rename'
import autoprefixer from 'gulp-autoprefixer'
import uglify from 'gulp-uglify'
import concat from 'gulp-concat'
import imagemin from 'gulp-imagemin'
import pkg from 'gulp'
const { parallel, watch, series, src, dest } = pkg
import { deleteAsync } from 'del'
import browserSync from 'browser-sync'

/* PATH'S */

const srcPath = 'src/'
const distPath = 'dist/'

const path = {
    build: {
        html: distPath,
        css: distPath + 'styles/',
        js: distPath + 'scripts/',
        images: distPath + 'images/',
        svg: distPath + 'images/',
    },
    src: {
        html: srcPath + '*.html',
        css: [srcPath + 'scss/*.scss', !srcPath + 'scss/_*.scss'],
        js: srcPath + 'scripts/*.js',
        images: srcPath + 'images/**/*.{jpg,png,gif,ico}',
        svg: srcPath + 'images/**/*.svg'
    },
    watch: {
        html: srcPath + '**/*.html',
        css: srcPath + 'scss/**/*.scss',
        js: srcPath + 'scripts/**/*.js',
        images: srcPath + 'images/**/*.{jpg,png,gif,ico}',
        svg: srcPath + 'images/**/*.svg'
    },
    clean: './' + distPath,
}

/* TASKS */

function server() {
    browserSync.init({
        server: {
            baseDir: './',
        },
    })
}

function clean() {
    return deleteAsync(path.clean)
}

function css() {
    return src(path.src.css, { base: srcPath + 'scss/' })
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(
            cssnano({
                zindex: false,
            })
        )
        .pipe(
            rename({
                suffix: '.min',
                extname: '.css',
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({ stream: true }))
}

function js() {
    return src(path.src.js, { base: srcPath + 'scripts/' })
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(
            rename({
                suffix: '.min',
                extname: '.js',
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({ stream: true }))
}

function images() {
    return src(path.src.images, { base: srcPath + 'images/' })
        .pipe(dest(path.build.images))
        .pipe(imagemin())
        .pipe(dest(path.build.images))
        .pipe(browserSync.reload({ stream: true }))
}

function svg() {
    return src(path.src.svg, { base: srcPath + 'images/' })
        .pipe(dest(path.build.svg))
        .pipe(browserSync.reload({ stream: true }))
}

function watchers() {
    watch(path.watch.css, css)
    watch(path.watch.js, js)
    watch(path.watch.images, images)
    watch(path.watch.svg, svg)
}

/* BUILD and DEV */

const build = () => {
    return series(clean, parallel(css, js, images, svg))
}

const dev = () => {
    return parallel(watchers, server)
}

gulp.task('default', parallel(build(), dev()))





















// const path = {
//   html: './index.html',
// }

// function server() {
//   browserSync.init({
//     server: {
//       baseDir: './',
//     },
//     port: 9000,
//     notify: false,
//   })
// }

// function buildStyles() {
//   deleteAsync('./dist/**/*.css')
//   return src('./src/styles/**/*.scss')
//     .pipe(sass.sync().on('error', sass.logError))
//     .pipe(autoPrefixer())
//     .pipe(
//       rename({
//         suffix: '.min',
//         basename: 'styles',
//       })
//     )
//     .pipe(gulp.dest('./dist/css'))
// }

// function watchers() {
//   watch('./src/styles/**/*.scss', buildStyles).on('change', browserSync.reload)
// }

// gulp.task('default', parallel(server, buildStyles, watchers))
