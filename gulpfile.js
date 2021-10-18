/* eslint-disable prettier/prettier */
const gulp          = require('gulp');
const htmlPartial   = require('gulp-html-partial');
const	sass          = require('gulp-sass');
const	cleancss      = require('gulp-clean-css');
const	autoprefixer  = require('gulp-autoprefixer');
const	smartgrid     = require('smart-grid');
const	gcmq          = require('gulp-group-css-media-queries');
const	rename        = require('gulp-rename');
const svgstore      = require('gulp-svgstore');
const svgmin        = require('gulp-svgmin');
const imagemin      = require('gulp-imagemin');
const	browserSync   = require('browser-sync').create();
const	notify        = require("gulp-notify");
const	del           = require("del");
const	wait          = require('gulp-wait');
const	webpackStream = require('webpack-stream');
const	webpack       = require('webpack');
const flags         = require('yargs').argv;
const gulpif        = require('gulp-if');
const named         = require('vinyl-named');
const glob          = require('glob');
const path          = require('path');
const sourcemaps    = require('gulp-sourcemaps');
const cssUrls       = require('gulp-css-urls');

const { mode } = flags; // --mode=dev || --mode=prod
const isDev = mode === 'dev' || mode === undefined;
const isProd = mode === 'prod';

const webpackConfig = {
  target: 'es5',
  module: {
    rules: [
      {
        test: /\.js/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      },
      { 
        test: /\.json$/, 
        type: 'javascript/auto',
        loader: 'json-loader',
      },
    ]
  },
  resolve: {
    alias: {
      'node_modules': path.resolve(__dirname, 'node_modules'),
      '@': path.resolve(__dirname, 'src/js/')
    }
  },
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-source-map' : false,
  plugins: [
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
    }),
  ],
};

function html() {
  return gulp
    .src(['src/*.html'])
    .pipe(htmlPartial({basePath: 'src/partials/'}))
    .pipe(gulp.dest('./build/'));
}

function css() {
  return gulp
    .src('src/sass/**/*.scss'/* , { sourcemaps: true } */)
    .pipe(wait(500))
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
    .pipe(rename({ suffix: '.min', prefix : '' }))
    .pipe(gulpif(isProd, gcmq()))
    .pipe(gulpif(isProd, autoprefixer(['last 15 versions'])))
    .pipe(
      gulpif(
        isProd, 
        cleancss( {
          level: { 2: { specialComments: 0 } } }
        )
      )
    )
    .pipe(cssUrls(
      function(url) {
        let stringForBuildDir = '';
        if (url.indexOf('img/') !== -1 ) {
          stringForBuildDir = url.substring(url.indexOf('img/'));
          return `../${stringForBuildDir}`;
        }

        if (url.indexOf('fonts/') !== -1 ) {
          stringForBuildDir = url.substring(url.indexOf('fonts/'));
          return `../${stringForBuildDir}`;
        }

        return `${url}`;
      }, {
        sourcemaps: true,
      }
    ))
    .pipe(gulpif(isDev, sourcemaps.write('.')))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}


/* function js() {
  const jsFilesPaths = glob.sync('./src/js/*.js');
  return gulp
    .src([...jsFilesPaths])
    .pipe(named())
    .pipe(
      webpackStream(webpackConfig, webpack, function(err, stats) {}))
	  .pipe(gulp.dest('build/js'));
} */

// js task for including core-js into all entries

function js() {
  const jsFilesPaths = glob.sync('./src/js/*.js');
  const pat = /(?<=js\/)(.*?)(?=\.js)/;
  const entriesArr = jsFilesPaths.map((item) => {
    const name = item.match(pat)[0];
    return {
      [name]: ['core-js/stable', item]
    };
  });

  const entries = Object.assign({}, ...entriesArr);

  return gulp
    .src([...jsFilesPaths])
    .pipe(named())
    .pipe(
      webpackStream({
        ...webpackConfig,
        entry: {...entries},
        output: { filename: '[name].js'}
      }, webpack, function(err, stats) {}))
	  .pipe(gulp.dest('build/js'));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  });

  gulp.watch('./src/sass/**/*.scss', css);
  gulp.watch('./src/js/**/*.js', gulp.series(js, reload));
  gulp.watch(
    ['./src/*.html', './src/partials/**/*.html'], 
    gulp.series(html, reload)
  );
  gulp.watch('src/img/**/*', gulp.series(img, reload));
}

function reload(done) {
  browserSync.reload();
  done();
}

function clean() {
  return del(['build/*']);
}

function svg() {
  return gulp
    .src('src/img/icons/*.svg')
    .pipe(svgmin(function min () {
      return {
        plugins: [{
          cleanupIDs: {
            minify: true
          }
        }]
      };
    }))
  .pipe(svgstore())
  .pipe(gulp.dest('build/img'));
}

async function sg() {

  /* It's principal settings in smart grid project */
  const settings = {
    filename: '_smart-grid',
    outputStyle: 'scss', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '30px', /* gutter width px || % */
    mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
        maxWidth: '1200px', /* max-width оn very large screen */
        fields: '30px' /* side fields */
    },
    breakPoints: {
      bp_1600: {
        width: '1600px',
      },
      bp_1440: {
        width: '1440px',
      },
      bp_1366: {
        width: '1366px',
      },
      bp_1280: {
        width: '1280px', /* -> @media (max-width: 1280px) */
      },
      bp_1100: {
        width: '1100px',
      },
      bp_960: {
        width: '960px',
      },
      bp_800: {
        width: '800px',
      },
      bp_768: {
        width: '768px',
        fields: '15px', /* set fields only if you want to change container.fields */
        offset: '15px'
      },
      bp_560: {
        width: '560px',
      },
      bp_375: {
        width: '375px',
      },
      bp_360: {
        width: '360px',
      },
      bp_320: {
        width: '360px',
      }

      /* 
      We can create any quantity of break points.

      some_name: {
          width: 'Npx',
          fields: 'N(px|%|rem)',
          offset: 'N(px|%|rem)'
      }
      */
    }
  };
  
  smartgrid('./src/sass/_mixins/', settings);
}

function img() {
  return gulp
    .src('src/img/**/*')
    .pipe(
      gulpif(
        isProd, 
        imagemin(
          [
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
          ],
          {
            verbose: true
          }
        )
      )
    )
    .pipe(gulp.dest('build/img'));
}

function fonts() {
  return gulp
    .src('src/fonts/**/*')
    .pipe(gulp.dest('build/fonts'));
}

const build = gulp.series(clean, gulp.parallel(html, css, js, img, fonts));

gulp.task('html', html);
gulp.task('reload', reload);
gulp.task('css', css);
gulp.task('js', js); 
gulp.task('clean', clean); 
gulp.task('svg', svg); 
gulp.task('sg', sg); 
gulp.task('img', img); 
gulp.task('watch', watch);
gulp.task('build', build);
gulp.task('default', gulp.series('build', 'watch'));