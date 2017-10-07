/* eslint-disable import/no-commonjs */
const babelRC = require('./settings/babelrc').node; // eslint-disable-line import/order


require('babel-register')(babelRC);

const path = require('path');
const util = require('util');

const fs = require('fs-extra');
const webpack = require('webpack');
const chalk = require('chalk');

const bootstrap = require('./bootstrap');
const webpackConfig = require('./webpack.config');
const StaticSiteGeneratorPlugin = require('./webpack/static-site-generator-plugin');

(async function build() {
    try {
        let files = await bootstrap.default();

        webpackConfig.plugins.push(
            new StaticSiteGeneratorPlugin({
                entry: 'static',
                paths: require('./_routes.json'), // eslint-disable-line global-require
                locals: {
                    template: files.template
                }
            })
        );

        const compiler = webpack(webpackConfig);

        console.log(chalk.bold('## starting webpack ##'));

        const run = util.promisify(compiler.run.bind(compiler));

        const stats = await run();

        if (stats.hasErrors()) {
            console.error(`Error: ${stats.toJson().errors}`);
            process.exit(1);
        } else {
            console.log(stats.toString());
            fs.copySync(
                path.resolve(__dirname, '../src/_includes'),
                path.resolve(__dirname, '../public'),
                { overwrite: true }
            );
        }
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
