import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeAttrs from 'rehype-attr';

import { imagesPlugin } from './tools/images-plugin';
import shikiTheme from './tools/vscode-themes/noctis/minimus.json';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CERTS_DIR = path.resolve(__dirname, './.certificates');
const CERTS_DIR_EXISTS = fs.existsSync(CERTS_DIR);
const SSL_KEY = CERTS_DIR_EXISTS
	? fs.readFileSync(path.resolve(CERTS_DIR, 'localhost-key.pem'), 'utf8')
	: null;
const SSL_CERT = CERTS_DIR_EXISTS
	? fs.readFileSync(path.resolve(CERTS_DIR, 'localhost.pem'), 'utf8')
	: null;

// https://astro.build/config
export default defineConfig({
	outDir: 'public',
	markdown: {
		syntaxHighlight: 'shiki',
		shikiConfig: {
			theme: shikiTheme as any,
		},
		remarkRehype: {
			allowDangerousHtml: true,
		} as any,
		rehypePlugins: [
			[rehypeAttrs, { properties: 'attr' }],
			[rehypeExternalLinks, { target: '_blank', rel: 'noopener noreferrer' }],
		],
	},
	server: { port: 4000 },
	vite: {
		server: {
			https:
				SSL_CERT && SSL_KEY
					? {
							// generate certificates using `mkcert localhost`
							key: SSL_KEY,
							cert: SSL_CERT,
					  }
					: false,
		},
		plugins: [imagesPlugin()],
	},
});
