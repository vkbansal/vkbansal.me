const path = require('path');

const parseDate = require('date-fns/parse');
const frontMatter = require('front-matter');
const markdown = require('markdown-it');
const mathjax = require("markdown-it-mathjax");
const decorate = require("markdown-it-decorate");
const span = require("../markdown-it/markdown-it-span");
const svgInline = require("../markdown-it/markdown-it-inline-svg")

const md = markdown({
    html: true
}).use(mathjax)
    .use(decorate)
    .use(span)
    .use(svgInline);

exports.processPostContent = function (content) {
     const meta= frontMatter(content);
     const body = md.render(meta.body);
     const result = Object.assign({}, meta.attributes, { body });

     return result;
}
