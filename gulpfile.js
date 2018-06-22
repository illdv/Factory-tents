const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer');
const uncss = require('postcss-uncss');
const minify = require('gulp-csso')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp');
const rename = require('gulp-rename')
const htmlclean = require('gulp-htmlclean');
const jsmin = require('gulp-jsmin');
const server = require('browser-sync').create();
const del = require('del');
const svgo = require('gulp-svgo');
const critical = require('critical');


gulp.task('critical', function () {
return critical.generate({
  base: 'build/',
  src: 'index.html',
  dest: 'styles/style.min.css',
  dest: 'index-critical.html',
    minify: true,
    width: 1300,
    height: 900
});
});

gulp.task('styles', function () {
  return gulp
    .src('source/sass/styles.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(minify())
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream())
});
gulp.task('uncss', function () {
  var plugins = [
    uncss({
      html: ['build/index.html'],
      ignore: ['.animated', '.animated.infinite', '.fadeIn', '.fadeInUp', 'flipInX', '.slideInLeft', '.slideInRight', /\.modal-open/, /\.show/, /\.modal-backdrop/, /\.fade/, /\.carousel-item-prev/, /\.carousel-item-next/, /\.carousel-item-left/, /\.carousel-item-right/, /\.was-validated/]
    }),
  ];
  return gulp.src('build/css/styles.min.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest('build/css'));
});

gulp.task('minHtml', function () {
  return gulp.src('source/*.html')
    .pipe(htmlclean({
      protect: /<\!--%fooTemplate\b.*?%-->/g,
      edit: function (html) {
        return html.replace(/\begg(s?)\b/ig, 'omelet$1');
      }
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('jsmin', function () {
  return gulp.src('source/js/*.js')
    .pipe(jsmin())

    .pipe(gulp.dest('build/js'));

});

gulp.task('serve', function () {
  server.init({
    server: 'build/',
  });
  gulp.watch('source/sass/**/*.{scss,sass}', gulp.parallel('styles'));
  gulp.watch('source/*.html', gulp.parallel('minHtml'))
    .on('change', server.reload);
  gulp.watch('source/js/*.js', gulp.parallel('jsmin'))
    .on('change', server.reload);
});


gulp.task('copy', function () {
  return gulp.src([
      'source/fonts/*.{woff,woff2}',
      'source/img/**',
    ], {
      base: 'source'
    })
    .pipe(gulp.dest('build'));
})
gulp.task('clean', function () {
  return del('build');
})
gulp.task('build', gulp.series('clean', 'minHtml', 'copy', 'jsmin', 'styles'));






gulp.task('images', function () {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest('source/img'))
})