const yaml = require('js-yaml');

module.exports = function(content) {
    this.cacheable && this.cacheable();

    const result = yaml.safeLoad(content);

    return `export default ${JSON.stringify(result)}`;
}
