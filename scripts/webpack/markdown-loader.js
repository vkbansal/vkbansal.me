const frontMatter = require('front-matter');
const markdown = require('markdown-it');
const mathjax = require("markdown-it-mathjax");
const decorate = require("markdown-it-decorate");
const span = require("../markdown-it/markdown-it-span");
const svgInline = require("../markdown-it/markdown-it-inline-svg")
const htmlLoader = require('html-loader');

const md = markdown({
    html: true
}).use(mathjax)
    .use(decorate)
    .use(span)
    .use(svgInline);

module.exports = function (content) {
    this.cacheable && this.cacheable();
    const meta= frontMatter(content);
    const attributes = JSON.stringify(meta.attributes).slice(1, -1);

    let body = md.render(meta.body);

    body = htmlLoader.call(this, body).slice(18, -4);

    return `export default {${attributes}, body: "${body}"};`;
};
