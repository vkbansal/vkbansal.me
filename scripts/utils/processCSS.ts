import * as path from 'path';

import sass from 'sass';
import postcss from 'postcss';
import localByDefault from 'postcss-modules-local-by-default';
import Scope from 'postcss-modules-scope';
import cssNano from 'cssnano';

import { isProduction, stringHash } from './miscUtils';

const scope = Scope({
    generateScopedName(exportedName, filepath, css) {
        const hash = stringHash(exportedName + filepath + css, 'sha1', 'hex').slice(0, 6);
        const name = filepath
            .replace(process.cwd(), '')
            .replace(/[^A-Z0-9]/gi, '_')
            .replace(/^[^A-Z0-9]/, '');

        if (isProduction()) {
            return hash;
        }

        return `${name}__${exportedName}__${hash}`;
    }
});

export async function processCSS(
    data: string,
    filePath: string,
    mode: 'local' | 'global' = 'local'
) {
    try {
        const exportTokens: Record<string, string> = {};

        const extractExports = postcss.plugin('postcss-extract-imports', () => {
            return function(root) {
                root.each(node => {
                    if (node.type == 'rule' && node.selector == ':export') {
                        node.each(decl => {
                            if (decl.type == 'decl') {
                                exportTokens[decl.prop] = decl.value;
                            }
                        });
                        node.remove();
                    }
                });
            };
        });

        const postCSSPlugins = [localByDefault({ mode }), scope, extractExports];

        if (isProduction()) {
            postCSSPlugins.push(cssNano);
        }

        const css = sass.renderSync({ data, includePaths: [path.join(process.cwd(), 'styles')] });
        const parser = postcss(postCSSPlugins);
        const result = await parser.process(css.css, { from: filePath });

        return { css: result.css, exports: exportTokens };
    } catch (e) {
        console.log(e);

        process.exit(1);
    }
}
