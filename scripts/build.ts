import chalk from 'chalk';

import { StaticSiteBuilder } from './StaticSiteBuilder';

try {
    (async function() {
        const builder = new StaticSiteBuilder();

        console.log(chalk.green('Starting Build...'));

        await builder.build();

        console.log(chalk.green('Build completed!'));
    })();
} catch (e) {
    console.log(chalk.red('Build failed!'));
    console.log(e);
}
