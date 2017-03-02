const postUtils = require('../utils/posts');

module.exports = function (content) {
    // this.cacheable();

    const data = postUtils.processPostContent(content);
    this.value = data;

    return `export default ${JSON.stringify(data)}`;
};
