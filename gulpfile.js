const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer');
const minify = require('gulp-csso')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp');
const rename = require('gulp-rename')

const server = require('browser-sync').create();
const del = require('del');


gulp.task('styles', function () {
  return gulp
    .src('source/sass/styles.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream())
});
gulp.task('copy:html', function () {
  return gulp.src(
      'source/*.html', {
        base: 'source'
      })
    .pipe(gulp.dest('build'));
})

gulp.task('serve', function () {
  server.init({
    server: 'build/',
  });
  gulp.watch('source/sass/**/*.{scss,sass}', gulp.parallel('styles'));
  gulp.watch('source/*.html', gulp.parallel('copy:html'))
    .on('change', server.reload);

});

gulp.task('images', function () {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]
    })
]))
    .pipe(gulp.dest('source/img'))
})


// gulp.tast('webp', function () {
//   return gulp.src('source/img/**/*.{png,jpg}')
//     .pipe(webp({
//       quality: 90
//     }))
//     .pipe(gulp.dest('source/img'));
// })
gulp.task('copy', function () {
  return gulp.src([
      'source/fonts/*.{woff,woff2}',
      'source/img/**',
      'source/js/**',
      'source/*.html',
    ], {
      base: 'source'
    })
    .pipe(gulp.dest('build'));
})
gulp.task('clean', function () {
  return del('build');
})
gulp.task('build', gulp.series('clean', 'copy', 'styles'));