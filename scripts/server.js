const babelRC = require('./settings/babelrc').node

require('babel-register')(babelRC);

const Express = require('express');
const chalk = require('chalk');
const opener = require('opener');
const webpack = require('webpack');

const template = require('./templates/html.template');
const webpackConfig = require('./webpack.config');

const app = new Express();

const PORT = process.env.PORT || 9000;
const HOST = process.env.IP || process.env.HOST || 'localhost';

const boostrap = require('./bootstrap');

(async function () {
    try {
        await boostrap.default();

        webpackConfig.entry = './_app.js'

        console.log(chalk.bold('## setting up webpack ##'));
        let compiler = webpack(webpackConfig);

        app.use(require('webpack-dev-middleware')(compiler, {
            publicPath: webpackConfig.output.publicPath
        }));

        app.get('*', (req, res) => res.status(200).send(template({})));

        console.log(chalk.bold('## starting server ##'));
        app.listen(PORT, HOST, function (err) {
            if (err) {
                throw new Error(err);
            }

            let url = `http://${HOST}:${PORT}`;

            // console.log(`Serving from ${root}`);
            console.log(`Server started at ${url}`);
            // opener(url);
        });

    } catch (e) {
        console.log(e);
    }


    // webpackConfig.entry.unshift('webpack-hot-middleware/client');
    // webpackConfig.plugins = [
    //     new webpack.HotModuleReplacementPlugin(),
    //     new webpack.NoErrorsPlugin()
    // ];



    // app.use(require('webpack-hot-middleware')(compiler));

})()
