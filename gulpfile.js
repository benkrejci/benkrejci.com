// generated on 2016-08-16 using generator-webapp 2.1.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;
const path = require('path');
const fs = require('fs');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const process = require('process');

const CSS_AUTOPREFIXER_BROWSERS = ['> 1%', 'last 2 versions', 'Firefox ESR'];

gulp.task('styles', () => {
  return gulp.src('app/styles/*.css')
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer({browsers: CSS_AUTOPREFIXER_BROWSERS}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('less', () => {
  return gulp.src('app/less/**/*.less')
    .pipe(gulp.dest('.tmp/less'))
    .pipe(reload({stream: true }));
});

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
    .pipe(gulp.dest('test/spec/**/*.js'));
});

gulp.task('html', ['generate-favicon', 'styles', 'scripts'], () => {
  return gulp.src('app/*.html')
    // Inject the favicon markups in your HTML pages. You should run
    // this task whenever you modify a page. You can keep this task
    // as is or refactor your existing HTML pipeline.
    .pipe($.realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe($.useref({
      searchPath: ['.tmp', 'app', '.'],
      types: ['js', 'css', 'less'],
      less: function (content, target, options, alternateSearchPath) {
        return '<link rel="stylesheet" href="' + target.replace(/\.less$/, '.css') + '" />';
      }
    }))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.less', $.less({
      paths: [ path.join(__dirname, 'app/less/includes') ]
    })))
    .pipe($.if('*.css', $.autoprefixer({browsers: CSS_AUTOPREFIXER_BROWSERS})))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src([
    'app/images/**/*',
    '!app/images/**/*.src.*'
  ]).pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('.tmp/images'))
    .pipe(gulp.dest('dist/images'));
});



// File where the favicon markups are stored
var FAVICON_DATA_FILE = path.join(__dirname, 'faviconData.json');

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
  $.realFavicon.generateFavicon({
    masterPicture: path.join(__dirname, 'app/images/icon.320.png'),
    dest: path.join(__dirname, 'dist'),
    iconsPath: '/',
    design: {
      ios: {
        masterPicture: path.join(__dirname, 'app/images/icon.320.white.png'),
        pictureAspect: 'noChange',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: true,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        },
        appName: 'BenKrejci.com'
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#444444',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: true,
            rectangle: false
          }
        },
        appName: 'BenKrejci.com'
      },
      androidChrome: {
        masterPicture: path.join(__dirname, 'app/images/icon.320.glow.png'),
        pictureAspect: 'noChange',
        themeColor: '#444444',
        manifest: {
          name: 'BenKrejci.com',
          display: 'browser',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        },
        assets: {
          legacyIcon: true,
          lowResolutionIcons: false
        }
      },
      safariPinnedTab: {
        pictureAspect: 'silhouette',
        themeColor: '#d66ec6'
      }
    },
    settings: {
      compression: 3,
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function() {
    done();
  });
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  $.realFavicon.checkForUpdates(currentVersion, function(err) {
    if (err) {
      throw err;
    }
  });
});

gulp.task('favicon', ['check-for-favicon-update', 'generate-favicon']);

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'less', 'scripts', 'images', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    '.tmp/less/**/*.less',
    '.tmp/images/**/*',
    '.tmp/fonts/**/*',
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.css', ['styles']);
  gulp.watch('app/less/**/*.less', ['less']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/images/**/*', ['images']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap.js'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
