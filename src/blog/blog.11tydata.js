module.exports = {
  eleventyComputed: {
    layout(data) {
      return data.page.layout || 'blog';
    },
    author(data) {
      return data.author || data.site.author;
    }
  }
};
