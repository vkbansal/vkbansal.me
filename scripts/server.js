const babelRC = require('./settings/babelrc').node

require('babel-register')(babelRC);

const Express = require('express');
const chalk = require('chalk');
const webpack = require('webpack');

const template = require('./templates/html.template');
const webpackConfig = require('./webpack.config');
const groupWebpackAssets = require('./utils/group-webpack-assets').default;

const app = new Express();

const PORT = process.env.PORT || 9000;
const HOST = process.env.IP || process.env.HOST || 'localhost';

const boostrap = require('./bootstrap');

(async function () {
    try {
        await boostrap.default();

        console.log(chalk.bold('## setting up webpack ##'));
        webpackConfig.entry.static.splice(0, 0, 'react-hot-loader/patch', 'webpack-hot-middleware/client');
        webpackConfig.module.rules[0].use.unshift({loader: 'react-hot-loader/webpack'});
        webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
        webpackConfig.plugins.push(new webpack.NamedModulesPlugin());

        let compiler = webpack(webpackConfig);

        app.use(require('webpack-dev-middleware')(compiler, {
            publicPath: webpackConfig.output.publicPath,
            serverSideRender: true
        }));

        app.use(require('webpack-hot-middleware')(compiler));

        app.get('*', (req, res) => {
            const assets = groupWebpackAssets(res.locals.webpackStats.toJson().assetsByChunkName);

            res.status(200).send(template({ assets }))
        });

        console.log(chalk.bold('## starting server ##'));
        app.listen(PORT, HOST, function (err) {
            if (err) {
                throw new Error(err);
            }

            let url = `http://${HOST}:${PORT}`;
            console.log(chalk.bold(`## server started at ${url} ##`));
        });

    } catch (e) {
        console.log(e);
    }
})()
