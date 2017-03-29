/* eslint-disable import/no-commonjs */
const fs = require('fs');
const path = require('path');

const yaml = require('js-yaml');

const contents = fs.readFileSync(path.resolve(__dirname, '../../settings.yml'), 'utf8');

module.exports = yaml.safeLoad(contents);
