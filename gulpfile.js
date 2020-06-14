const cp = require('child_process');

const { src, dest, series, parallel, watch } = require('gulp');

const hash = require('./_gulp/gulp-hash');
const sass = require('./_gulp/gulp-sass');
const gulpIf = require('./_gulp/gulp-if');

const PROD = process.env.NODE_ENV === 'production';

function clean() {
  return cp.spawn('npx', ['rimraf', 'public', '.hashes.json'], { stdio: 'inherit' });
}

const IMG_GLOBS = ['src/**/*.png', 'src/**/*.jpg', 'src/**/*.svg', 'src/**/*.gif'];

function images() {
  return src(IMG_GLOBS).pipe(gulpIf(PROD, hash())).pipe(dest('public'));
}

function compileSass() {
  return src('src/styles/main.scss')
    .pipe(sass())
    .pipe(gulpIf(PROD, hash()))
    .pipe(dest('public/styles'));
}

function eleventy(shouldWatch) {
  const options = ['eleventy', '--quiet'];

  if (shouldWatch === true) {
    options.push('--watch');
  }

  return cp.spawn('npx', options, { stdio: 'inherit' });
}

exports.watch = function () {
  clean();
  watch('src/styles/**/*.scss', { ignoreInitial: false }, compileSass);
  watch(IMG_GLOBS, { ignoreInitial: false }, images);
  eleventy(true);
};

exports.default = series(clean, parallel(images, compileSass), eleventy);
exports.clean = clean;
