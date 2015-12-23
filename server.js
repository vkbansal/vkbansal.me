"use strict";

let Express = require("express"),
    path = require("path"),
    config = require("./config"),
    opener = require("opener"),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config');

let app = new Express(),
    root = path.resolve(__dirname, config.location.destination);

webpackConfig.entry.unshift("webpack-hot-middleware/client");
webpackConfig.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
];

let compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(Express.static(root));

app.listen(config.server.port, config.server.host, function (err) {
    if (err) {
        console.log(err);
    }

    let url = `${config.server.protocol}://${config.server.host}:${config.server.port}`;

    console.log(`Serving ${root}`);
    console.log(`Server started at ${url}`);
    opener(url);
});
