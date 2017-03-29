/* eslint-disable import/no-commonjs */
const babelRC = require('./settings/babelrc').node; // eslint-disable-line import/order

require('babel-register')(babelRC);

const Express = require('express');
const chalk = require('chalk');
const webpack = require('webpack');

const webpackConfig = require('./webpack.config');
const groupWebpackAssets = require('./utils/group-webpack-assets').default;
const boostrap = require('./bootstrap');

const app = new Express();
const PORT = process.env.PORT || 9000;
const HOST = process.env.IP || process.env.HOST || 'localhost';

(async function server() {
    try {
        const files = await boostrap.default();

        console.log(chalk.bold('## setting up webpack ##'));
        webpackConfig.entry.static.splice(0, 0, 'react-hot-loader/patch', 'webpack-hot-middleware/client');
        webpackConfig.module.rules[0].use.unshift({ loader: 'react-hot-loader/webpack' });
        webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
        webpackConfig.plugins.push(new webpack.NamedModulesPlugin());

        let compiler = webpack(webpackConfig);

        app.use(require('webpack-dev-middleware')(compiler, { // eslint-disable-line global-require
            publicPath: webpackConfig.output.publicPath,
            serverSideRender: true
        }));

        app.use(require('webpack-hot-middleware')(compiler)); // eslint-disable-line global-require

        app.get('*', (req, res) => {
            const assets = groupWebpackAssets(res.locals.webpackStats.toJson().assetsByChunkName);

            res.status(200).send(files.template({ assets }));
        });

        console.log(chalk.bold('## starting server ##'));
        app.listen(PORT, HOST, (err) => {
            if (err) {
                throw new Error(err);
            }

            let url = `http://${HOST}:${PORT}`;
            console.log(chalk.bold(`## server started at ${url} ##`));
        });
    } catch (e) {
        console.log(e);
    }
})();
