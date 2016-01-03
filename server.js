"use strict";

let Express = require("express"),
    path = require("path"),
    config = require("./config"),
    opener = require("opener"),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config');

require("dotenv").load();

let app = new Express(),
    root = path.resolve(__dirname, config.location.destination);

webpackConfig.entry.unshift("webpack-hot-middleware/client");
webpackConfig.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
];

let compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(Express.static(root));

app.listen(process.env.PORT, process.env.IP, function (err) {
    if (err) {
        console.log(err);
    }

    let url = `http://${process.env.IP}:${process.env.PORT}`;

    console.log(`Serving ${root}`);
    console.log(`Server started at ${url}`);
    opener(url);
});
