import path from 'node:path';
import { camelCase } from 'change-case';
import type { PluginOption } from 'vite';
import type { TransformResult } from 'rollup';

const HTML_REGEX = /const\s+html\s+=\s+(".*");/;
const IMG_REGEX = /<img\s.*?(src=('|")(.*?)(\2)).*?>/g;

function processHTMLContent(content: string, imgImports: string[]): string {
	const newContent = content.replace(IMG_REGEX, (imgTag, fullSrc, _0, src) => {
		const variableName = camelCase(path.basename(src));

		imgImports.push(`import ${variableName} from "${src}";`);

		const updatedImg = imgTag.replace(fullSrc, 'src="${' + variableName + '}"');

		return updatedImg;
	});

	return newContent;
}

export function imagesPlugin(): PluginOption {
	return {
		name: 'images-plugin',
		enforce: 'pre',
		transform(code: string, id: string): TransformResult {
			if (id.endsWith('md')) {
				const imgImports: string[] = [];
				const result = code.replace(HTML_REGEX, (_0, html) => {
					const preprocessedHTML = JSON.parse(html) // to unescape the string
						.replace(/(\\|\$|`)/g, '\\$1'); // escape all \, $, and `
					const processedHTML = processHTMLContent(preprocessedHTML, imgImports);

					return `const html = \`${processedHTML}\`;`;
				});

				const finalCode = `${imgImports.join('\n')}\n${result}`;

				return {
					code: finalCode,
				};
			}
		},
	};
}
