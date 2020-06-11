const yaml = require('js-yaml');

module.exports = (eleventyConfig) => {
  // eleventyConfig.addPassthroughCopy('**/*.{jpg,svg,png,gif}');

  eleventyConfig.addDataExtension('yaml', (contents) => yaml.safeLoad(contents));

  eleventyConfig.setBrowserSyncConfig({
    notify: true
  });

  return {
    dir: {
      input: 'src/pages',
      output: 'public',
      layouts: '_layouts',
      templateFormats: ['njk', 'md', '11ty.js']
    }
  };
};
