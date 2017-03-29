/* eslint-disable import/no-commonjs */
const yaml = require('js-yaml');

module.exports = function YAMLLoader(content) {
    if (this.cacheable) this.cacheable();

    const result = yaml.safeLoad(content);

    return `export default ${JSON.stringify(result)}`;
};
