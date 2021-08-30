const fs = require('fs');
const path = require('path');
const dateFns = require('date-fns');

const yaml = require('js-yaml');
const md = require('./_eleventy/markdown');
const resolveHashes = require('./_eleventy/resolve-hashes');

const INPUT_DIR = 'src';
const INPUT_DIR_ABS = path.join(process.cwd(), INPUT_DIR);
const PROD = process.env.NODE_ENV === 'production';

console.log(`Is prodution build?: ${PROD}`);

module.exports = (eleventyConfig) => {
  let hashes = {};
  const now = new Date();

  if (PROD) {
    const hashesFile = path.join(__dirname, '.hashes.json');
    const fileExists = fs.existsSync(hashesFile);

    if (fileExists) {
      hashes = JSON.parse(fs.readFileSync(hashesFile, 'utf-8'));
    }
  }

  eleventyConfig.setLibrary('md', md(INPUT_DIR, hashes));

  eleventyConfig.addNunjucksFilter('hash', function (value) {
    const { inputPath } = this.ctx.page;

    return resolveHashes(INPUT_DIR, inputPath, value, hashes);
  });

  eleventyConfig.addNunjucksFilter('formatDate', function (value, format) {
    return dateFns.format(value, format);
  });

  eleventyConfig.addNunjucksFilter('formatDateDistanceFromNow', function (value) {
    return dateFns.formatDistance(new Date(), value);
  });

  eleventyConfig.addNunjucksFilter('startsWith', function (value, str) {
    return value.startsWith(str);
  });

  eleventyConfig.addNunjucksFilter('_slice', function (value, start, end) {
    return value.slice(start, end);
  });

  eleventyConfig.addCollection('posts', function (collectionApi) {
    return collectionApi
      .getFilteredByGlob(['src/blog/**/*.md'])
      .filter((p) => (PROD ? !dateFns.isAfter(p.date, now) || p.draft : true));
  });

  eleventyConfig.addDataExtension('yaml', (contents) => yaml.load(contents));

  eleventyConfig.setBrowserSyncConfig({ notify: !PROD });

  return {
    dir: {
      input: INPUT_DIR,
      output: 'public',
      includes: '_layouts',
      layouts: '_layouts',
      templateFormats: ['njk', 'md', '11ty.js'],
      markdownTemplateEngine: 'nunjucks'
    }
  };
};
