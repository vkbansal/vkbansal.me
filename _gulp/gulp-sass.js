const Stream = require('stream');
const path = require('path');
const sass = require('sass');
const PluginError = require('plugin-error');

module.exports = function gulpSass() {
  const stream = new Stream.Transform({ objectMode: true });

  stream._transform = function (file, buffer, done) {
    if (file.isNull()) {
      done(null, file);
      return;
    }

    if (file.isStream()) {
      done(null, file);
      return;
    }

    if (file.contents.length === 0) {
      done(null, file);
      return;
    }

    try {
      const ext = path.extname(file.relative);
      const newPath = path.join(file.base, file.relative.replace(ext, `.css`));
      const sassObj = sass.renderSync({
        data: file.contents.toString(),
        file: file.relative,
        importer(url) {
          if (url.startsWith('~')) {
            return {
              file: path.join(process.cwd(), 'node_modules', url.slice(1))
            };
          }

          return {
            file: url
          };
        },
        includePaths: [process.cwd(), path.join(process.cwd(), 'src/styles')]
      });

      file.contents = sassObj.css;
      file.path = newPath;
    } catch (e) {
      done(new PluginError('gulp-sass', e));
      return;
    }

    done(null, file);
  };

  return stream;
};
