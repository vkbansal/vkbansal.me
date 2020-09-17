const shiki = require('shiki');
const markdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const resolveHashes = require('./resolve-hashes');

function escapeHtml(html) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderToHtml(lines, options = {}) {
  const bg = options.bg || '#fff';

  let html = '';

  html += `<pre ${
    options.langId ? `data-language="${options.langId}" ` : ''
  }style="background-color: ${bg}"><code>`;
  lines.forEach((l) => {
    if (l.length === 0) {
      html += `\n`;
    } else {
      l.forEach((token) => {
        html += `<span style="color: ${token.color}">${escapeHtml(token.content)}</span>`;
      });
      html += `\n`;
    }
  });
  html = html.replace(/\n*$/, ''); // Get rid of final new lines
  html += `</code></pre>`;

  return html;
}

/**
 *
 * @param {string} inputDir     Directory with source code
 * @param {object} hashes       hash map
 */
module.exports = function getRenderer(inputDir, hashes) {
  return {
    async render(data, env) {
      const highlighter = await shiki.getHighlighter({ theme: 'solarized-dark' });
      const md = markdownIt({
        html: true,
        linkify: true,
        highlight(code, language) {
          try {
            const tokens = highlighter.codeToThemedTokens(code, language);

            return renderToHtml(tokens, { langId: language, bg: '#002B36' });
          } catch (_e) {
            return code;
          }

          return code;
        }
      });

      md.use(markdownItAttrs);

      const defaultImageRender = md.renderer.rules.image;

      md.renderer.rules.image = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        const aIndex = token.attrIndex('src');
        const src = token.attrs[aIndex][1];

        token.attrs[aIndex][1] = resolveHashes(inputDir, env.page.inputPath, src, hashes);

        return defaultImageRender(tokens, idx, options, env, self);
      };

      return md.render(data, env);
    }
  };
};
