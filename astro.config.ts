import { type RehypePlugin } from '@astrojs/markdown-remark';
import type { ThemeRegistration } from 'shiki';
import { transformerTwoslash } from '@shikijs/twoslash';
import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers';
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeAttrs from 'rehype-attr';

import { imagesPlugin } from './tools/images-plugin';
import shikiTheme from './tools/vscode-themes/noctis/minimus.json';

// https://astro.build/config
export default defineConfig({
	outDir: 'dist',
	markdown: {
		shikiConfig: {
			theme: shikiTheme as ThemeRegistration,
			transformers: [
				transformerTwoslash({ explicitTrigger: true }),
				transformerNotationDiff(),
				transformerNotationHighlight(),
			],
		},
		remarkRehype: {
			allowDangerousHtml: true,
		},
		rehypePlugins: [
			[rehypeAttrs as unknown as RehypePlugin, { properties: 'attr' }],
			[rehypeExternalLinks, { target: '_blank', rel: 'noopener noreferrer' }],
		],
	},
	server: { port: 4000 },
	vite: {
		plugins: [imagesPlugin()],
	},
});
