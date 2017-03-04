const path = require('path');
const webpack = require('webpack');
const settings = require('./settings');
const babelRC = require('./settings/babelrc').webpack;

const PROD = process.env.NODE_ENV === 'production';

const config = {
    context: __dirname,
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../public'),
        sourceMapFilename: 'bundle.js.map',
        publicPath: '/',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use:[{
                    loader: 'babel-loader',
                    options: babelRC
                }],
                include: [
                    path.resolve(__dirname, '..')
                ]
            }, {
                test: /\.md$/,
                use: ['markdown-loader'],
                include: [
                    path.resolve(__dirname, '..')
                ]
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
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': PROD
                    ? JSON.stringify('production')
                    : JSON.stringify('development')
            }
        })
    ]
};

module.exports = config;
