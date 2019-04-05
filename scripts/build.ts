import * as path from 'path';

import chalk from 'chalk';

import { StaticSiteBuilder } from './StaticSiteBuilder';

try {
    (async function() {
        const builder = new StaticSiteBuilder({
            srcGlob: 'pages/**/*.{ts,md}',
            outputPath: path.join(process.cwd(), 'public'),
            mainTemplatePath: path.join(process.cwd(), 'templates/mainTemplate.ts'),
            blogPageTemplatePath: path.join(process.cwd(), 'templates/blogPageTemplate.ts')
        });

        console.log(chalk.green('Starting Build...'));

        await builder.build();

        console.log(chalk.green('Build completed!'));
    })();
} catch (e) {
    console.log(chalk.red('Build failed!'));
    console.log(e);
}
