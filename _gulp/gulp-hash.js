const crypto = require('crypto');
const Stream = require('stream');
const path = require('path');
const Vinyl = require('vinyl');
const through = require('through2');

const map = {};

module.exports = function gulpHash(options = {}) {
  return through.obj(
    function (file, buffer, done) {
      if (file.isNull()) {
        done(null, file);
        return;
      }

      if (file.isStream()) {
        done(null, file);
        return;
      }

      const hash = crypto
        .createHash('sha256')
        .update(file.contents, buffer)
        .digest('hex')
        .slice(0, 6);

      const ext = path.extname(file.relative);
      const relative = file.relative.replace(ext, `.${hash}${ext}`);
      const newPath = path.join(file.base, relative);

      const mapPath = path.relative(path.join(process.cwd(), 'src'), file.path);

      map[mapPath] = relative;

      file.path = newPath;

      done(null, file);
    },
    function (done) {
      const file = new Vinyl({
        cwd: process.cwd(),
        base: '.',
        path: '../.hashes.json',
        contents: Buffer.from(JSON.stringify(map, null, 2))
      });

      this.push(file);
      done();
    }
  );
};
