/* eslint-disable */
"use strict";

let webpack = require("webpack"),
    path = require("path");

process.env.NODE_ENV = "production";

module.exports = {
    context: process.cwd(),
    entry: [
        "./src/_js/index.js"
    ],
    output: {
        filename: "main.js",
        path: path.resolve(process.cwd(), "public", "assets"),
        sourceMapFileName: "main.js.map",
        publicPath: "/assets/"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ["babel"],
                include: [
                    path.resolve(process.cwd(), "src")
                ]
            }
        ]
    },
    devtool: "source-map",
    resolve: {
        extensions: [ '', '.js', '.jsx' ],
        fallback: path.join(process.cwd(), "node_modules")
    },
    resolveLoader: {
        root: path.join(process.cwd(), "node_modules")
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ]
};
