const { src, series, dest, watch } = require('gulp');
const conf = require("./config.json");
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require("gulp-clean-css");
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync").create();

// BrowserSync
function browsersyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: "html/",
      directory: true
    }
  });
  cb();
}

function browsersyncReload(cb) {
  browserSync.reload();
  cb();
}


/*! =======================================================
                    //CSS MINIFICATION STARTS
========================================================= */

//globalComponentcss minification

function globalcompscss() {
  return src(conf.src.srcCssWATTSbase + conf.src.sasssrc.globalComps)
    .pipe(sass({
      quietDeps: true
    }).on("error", sass.logError))
    .pipe(plumber())
    .pipe(concat("globalcomps.css"))
    .pipe(dest(conf.dest.destCssWATTSbase + conf.dest.cssdest.globalComps))
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(cleanCSS())
    .pipe(postcss([cssnano()]))
    .pipe(dest(conf.dest.destCssWATTSbase + conf.dest.cssdest.globalComps))
    .pipe(browserSync.reload({ stream: true }));
}

function homepageCSS() {
  return src(conf.src.srcCssWATTSbase + conf.src.sasssrc.homepage)
    .pipe(sass().on("error", sass.logError))
    .pipe(plumber())
    .pipe(concat("homepage.css"))
    .pipe(dest(conf.dest.destCssWATTSbase + conf.dest.cssdest.homepage))
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(cleanCSS())
    .pipe(postcss([cssnano()]))
    .pipe(dest(conf.dest.destCssWATTSbase + conf.dest.cssdest.homepage))
    .pipe(browserSync.reload({ stream: true }));
}


/*! =======================================================
                    //JS MINIFICATION STARTS
========================================================= */

//global js minification
function globalScripts() {
  // Minify and copy all JavaScript (except vendor scripts)
  return src(conf.globalScripts.src)
    .pipe(plumber())
    .pipe(concat("global.js"))
    .pipe(dest(conf.dest.destJsWATTSbase + conf.dest.jsdest.globaljs))
    .pipe(terser())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(dest(conf.dest.destJsWATTSbase + conf.dest.jsdest.globaljs))
    .pipe(browserSync.stream());
}

// //homepage js minification
// function homepagescripts() {
//     // Minify and copy all JavaScript (except vendor scripts)
//     return gulp
//         .src(conf.homepagescripts.src)
//         .pipe(plumber())
//         .pipe(concat("global.js"))
//         .pipe(gulp.dest(conf.dest.destJsWATTSbase + conf.dest.jsdest.homepagejs))
//         .pipe(terser())
//         .pipe(
//             rename({
//                 suffix: ".min",
//             })
//         )
//         .pipe(gulp.dest(conf.dest.destJsWATTSbase + conf.dest.jsdest.homepagejs))
//         .pipe(browserSync.stream());
// }


function watchTask() {
  // watching scripts/scss/twig/html files

  // gulp.watch("../../../Feature/**/**/*.js", gulp.series(scripts, reload));
  watch("**/*.html", browsersyncReload);
  watch(['assets/scss/**/*.scss', 'assets/scripts/**/*.js'], series(browsersyncReload));
}


// Default Gulp task
exports.WATTS = series(globalcompscss, globalScripts, homepageCSS, browsersyncServe, watchTask);

// Gulp component Task

// gulp.task(
//     "WATTS-CSS",
//     gulp.series(globalcompscss, homepage, browsersyncServe, watch),
//     function (cb) {
//         // Static Server
//     }
// );

// gulp.task(
//     "WATTS-JS",
//     gulp.series(globalScripts, homepagescripts),
//     function (cb) {
//         // Static Server
//     }
// );

