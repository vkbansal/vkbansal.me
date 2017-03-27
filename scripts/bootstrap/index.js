import chalk from 'chalk';

import globPages from './glob-pages';
import createRoutes from './create-routes';
import readTemplate from './read-template';

export default async function() {
    console.log(chalk.bold('## globbing pages ##'));
    let files = await globPages();

    console.log(`Found ${files.pages.length} pages`);
    console.log(`Found ${files.posts.length} posts`);

    console.log(chalk.bold('## creating routes ##'));
    await createRoutes(files);

    console.log(chalk.bold('## reading template ##'));
    const template = await readTemplate('index.hbs');

    return Object.assign(files, { template });
}
