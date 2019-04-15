import chalk from 'chalk';
import yargs from 'yargs';

const argv = yargs.parse();

import { StaticSiteBuilder } from './StaticSiteBuilder';

try {
    (async function() {
        const builder = new StaticSiteBuilder();

        console.log(chalk.green('Starting Build...'));

        if ('watch' in argv) {
            await builder.watch();
        } else {
            await builder.build();
            console.log(chalk.green('Build completed!'));
        }
    })();
} catch (e) {
    console.log(chalk.red('Build failed!'));
    console.log(e);
}
