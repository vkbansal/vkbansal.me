import fs from 'node:fs';
import path from 'node:path';
import { camelCase } from 'change-case';
import type { PluginOption } from 'vite';
import { parse, visit, print } from 'recast';

const IMG_REGEX = /<img\s.*?(src=('|")(.*?)(\2)).*?>/g;

function processHTMLContent(content: string, imgImports: string[]) {
	const newContent = content.replace(IMG_REGEX, (imgTag, fullSrc, _0, src) => {
		const variableName = camelCase(path.basename(src));

		imgImports.push(`import ${variableName} from "${src}";`);

		const updatedImg = imgTag.replace(fullSrc, 'src="${' + variableName + '}"');

		return updatedImg;
	});

	return parse(newContent);
}

export function imagesPlugin(): PluginOption {
	return {
		name: 'images-plugin',
		enforce: 'pre',
		transform(code, id) {
			if (id.endsWith('md')) {
				const imgImports = [];
				const ast = parse(code);

				visit(ast, {
					visitFunctionDeclaration(path) {
						if (path.node.id?.name === 'compiledContent') {
							const firstStatement = path.node.body.body[0];

							if (firstStatement.type === 'ReturnStatement' && firstStatement.argument) {
								const node = firstStatement.argument;
								firstStatement.argument = processHTMLContent(print(node).code, imgImports);
							}
						}

						return false;
					},
				});

				const finalCode = `${imgImports.join('\n')}\n${print(ast).code}`;

				if (id.endsWith('ml-advice-for-applying-machine-learning.md')) {
					fs.writeFileSync('temp.js', finalCode, 'utf8');
				}

				return {
					code: finalCode,
				};
			}
		},
	};
}
