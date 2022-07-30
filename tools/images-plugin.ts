import fs from 'node:fs';
import path from 'node:path';
import { camelCase } from 'change-case';
import type { PluginOption } from 'vite';
import { parse, visit, prettyPrint, type Options } from 'recast';

const printOptions: Options = {
	lineTerminator: '\n',
	useTabs: false,
	tabWidth: 2,
	arrowParensAlways: true,
	arrayBracketSpacing: true,
};

const IMG_REGEX = /<img\s.*?(src=('|")(.*?)(\2)).*?>/g;

function processHTMLContent(content: string, imgImports: string[]) {
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
		transform(code, id) {
			if (id.endsWith('md')) {
				const imgImports = [];
				const ast = parse(code);

				visit(ast, {
					visitFunctionDeclaration(path) {
						if (path.node.id?.name === 'compiledContent') {
							const returnStatement = path.node.body.body[0];

							if (returnStatement.type === 'ReturnStatement' && returnStatement.argument) {
								const { code } = prettyPrint(returnStatement.argument, printOptions);
								const processedHTML = processHTMLContent(code, imgImports);

								returnStatement.argument = parse(processedHTML).program.body[0];
							}
						}

						return false;
					},
				});

				const finalCode = `${imgImports.join('\n')}\n${prettyPrint(ast, printOptions).code}`;

				return {
					code: finalCode,
				};
			}
		},
	};
}
