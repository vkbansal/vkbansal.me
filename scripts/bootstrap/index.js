import chalk from 'chalk';

import globPages from './glob-pages';
import creatRoutes from './create-routes';

export default async function() {
    console.log(chalk.bold('## globbing pages ##'));
    let files = await globPages();

    console.log(`Found ${files.pages.length} pages`);
    console.log(`Found ${files.posts.length} posts`);

    console.log(chalk.bold('## creating routes ##'));
    await creatRoutes(files);

    return files;
}
