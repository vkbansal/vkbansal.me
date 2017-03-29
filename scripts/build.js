/* eslint-disable import/no-commonjs */
const babelRC = require('./settings/babelrc').node; // eslint-disable-line import/order


require('babel-register')(babelRC);

const path = require('path');

const fs = require('fs-extra');
const webpack = require('webpack');
const Promise = require('bluebird');
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

        const run = Promise.promisify(compiler.run.bind(compiler));

        const stats = await run();

        if (stats.hasErrors()) {
            console.log(`Error: ${stats.toJson().errors}`);
        } else {
            console.log(stats.toString());
            fs.copySync(
                path.resolve(__dirname, '../src/_includes'),
                path.resolve(__dirname, '../public_1'),
                { overwrite: true }
            );
            fs.moveSync(
                path.resolve(__dirname, '../public_1'),
                path.resolve(__dirname, '../public'),
                { overwrite: true }
            );
        }
    } catch (e) {
        console.log(e);
    }
})();
