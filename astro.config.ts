import { defineConfig } from 'astro/config';

import { imagesPlugin } from './tools/images-plugin';
import shikiTheme from './tools/vscode-themes/noctis/minimus.json';

// https://astro.build/config
export default defineConfig({
	outDir: 'public',
	markdown: {
		syntaxHighlight: 'shiki',
		shikiConfig: {
			theme: shikiTheme,
		},
	},
	vite: {
		plugins: [imagesPlugin()],
	},
});
