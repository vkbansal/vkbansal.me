const path = require('path');

/**
 *
 * @param {string} inputDir     Directory with source code
 * @param {string} templatePath Path of template form env/context
 * @param {string} src          Source asset
 * @param {object} hashes       hash map
 */
module.exports = function resolveHashes(inputDir, templatePath, src, hashes) {
  const resolvedPath = path.relative(
    inputDir,
    src.startsWith('/')
      ? path.join(inputDir, src.slice(1))
      : path.resolve(path.dirname(templatePath), src)
  );
  const mappedPath = hashes[resolvedPath];

  if (mappedPath) {
    if (src.startsWith('/styles')) {
      return `/styles/${mappedPath}`;
    }

    return `/${mappedPath}`;
  }

  return src;
};
