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
const	rsync         = require('gulp-rsync');
const	webpack       = require('webpack-stream');
const flags         = require('yargs').argv;
const gulpif        = require('gulp-if');
const named         = require('vinyl-named');
const glob          = require('glob');
const path          = require('path');

const { mode } = flags; // --mode=dev || --mode=prod
const isDev = mode === 'dev' || mode === undefined;
const isProd = mode === 'prod';

const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.js/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      }
    ]
  },
  resolve: {
    alias: {
      'node_modules': path.resolve(__dirname, 'node_modules'),
      '@': path.resolve(__dirname, 'src/js/')
    }
  },
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-source-map' : 'none'
};

function html() {
  return gulp
    .src(['src/*.html'])
    .pipe(htmlPartial({basePath: 'src/partials/'}))
    .pipe(gulp.dest('./build/'));
}

function css() {
  return gulp
    .src('src/sass/**/*.scss')
    .pipe(wait(500))
    .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
    .pipe(rename({ suffix: '.min', prefix : '' }))
    .pipe(gcmq())
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(
      gulpif(
        isProd, 
        cleancss( {
          level: { 2: { specialComments: 0 } } }
        )
      )
    ) 
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

function js() {
  const jsFilesPaths = glob.sync('./src/js/*.js');

  return gulp
    .src([...jsFilesPaths])
    .pipe(named())
    .pipe(webpack(webpackConfig))
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
        maxWidth: '1920px', /* max-width оn very large screen */
        fields: '52px' /* side fields */
    },
    breakPoints: {
      xl_2: {
        width: '1600px',
        fields: '48px'
      },
      xl_1: {
        width: '1440px',
        fields: '36px'
      },
      xl: {
        width: '1366px',
        fields: '24px'
      },
      lg: {
        width: '1280px', /* -> @media (max-width: 1100px) */
        fields: '24px'
      },
      md: {
        width: '960px',
        fields: '24px'
      },
      sm: {
        width: '768px',
        fields: '24px' /* set fields only if you want to change container.fields */
      },
      xs: {
        width: '560px',
        fields: '16px'
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
    .pipe(imagemin(
      [
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
      ],
      {
        verbose: true
      }
    ))
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