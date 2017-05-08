/* eslint-disable import/no-commonjs */
const path = require('path');

const webpack = require('webpack');
const Extract = require('extract-text-webpack-plugin');

const babelRC = require('./settings/babelrc').webpack;

const PROD = process.env.NODE_ENV === 'production';

let config = {
    context: __dirname,
    entry: {
        static: ['./app.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../public_1'),
        sourceMapFilename: 'bundle.js.map',
        publicPath: '/',
        libraryTarget: 'umd'
    },
    stats: {
        children: false
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: babelRC
                }],
                include: [
                    path.resolve(__dirname, '..')
                ]
            }, {
                test: /\.md$/,
                use: [{
                    loader: 'markdown-loader'
                }],
                include: [
                    path.resolve(__dirname, '..')
                ]
            }, {
                test: /\.ya?ml$/,
                use: [{
                    loader: 'yaml-loader'
                }],
                include: [
                    path.resolve(__dirname, '..')
                ]
            }, {
                test: /\.scss$/,
                use: Extract.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        query: {
                            modules: true,
                            localIdentName: PROD ? '[hash:base64:6]' : '[name]_[local]_[hash:base64:6]',
                            sourceMap: true
                        }
                    }, {
                        loader: 'sass-loader',
                        query: {
                            includePaths: [
                                path.resolve(__dirname, '../node_modules/'),
                                path.resolve(__dirname, '../src/styles/')
                            ],
                            sourceMap: true
                        }
                    }]
                }),
                include: [
                    path.resolve(__dirname, '../src')
                ]
            }, {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        name: PROD
                                ? 'img/[name]_[hash:6].[ext]'
                                : 'img/[name].[ext]'
                    }
                }]
            }
        ]
    },
    target: 'web',
    resolve: {
        modules: [
            path.resolve(__dirname, '..'),
            'node_modules'
        ],
        extensions: ['.js', '.json', '.md']
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, './webpack')]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: PROD
                    ? JSON.stringify('production')
                    : JSON.stringify('development')
            }
        }),
        new Extract({
            filename: PROD
                ? 'css/bundle.[contenthash:6].css'
                : 'css/bundle.css',
            allChunks: true
        })
    ]
};

if (!PROD) {
    config.devtool = 'source-map';
}

module.exports = config;
