---
title: Rollup, First Impressions
description: A quick look at Rollup and comparison to Webpack.
date: 2016-01-17
tags:
  - rollup
  - module-loaders
  - javascript
---

[Rollup](http://rollupjs.org/), as stated on its website, is a next-generation JavaScript module bundler. It is similar to [Browserify](http://browserify.org/) or [Webpack](https://webpack.github.io/), except that the resulting bundle (as per their claims) will always be smaller than that of Browserify's or Webpack's. It introduces a term called `tree-shaking` which basically means when a module is `require`(d), instead of importing the whole file, it will just include the required parts. You can visit their [website](http://rollupjs.org/) for more details.

I am an avid Webpack user, I use it almost in all of my projects. So I did a quick comparison of Rollup and Webpack.

## Let's Roll

Installing rollup is easy. Just run the following command:

```sh
npm install -g rollup
```

Rollup can be used via either the Command Line Interface (CLI) or JavaScript API. I like using the CLI (similar to what I use with Webpack).

I tested the examples bundle from my [react-contextmenu](https://github.com/vkbansal/react-contextmenu) package. The `examples.config.js` contains the Webpack configuration.

```js
// examples.config.js
var webpack = require('webpack');

module.exports = {
  entry: './examples/index.js',
  output: {
    filename: './bundle.js',
    sourceMapFileName: './bundle.js.map',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
  ],
};
```

After digging through [Rollup's wiki](https://github.com/rollup/rollup/wiki), I came up with the following configuration, which I believe is closest to that of Webpack's :

```js
//rollup.config.js
'use strict';

let babel = require('rollup-plugin-babel'),
  commonjs = require('rollup-plugin-commonjs'),
  npm = require('rollup-plugin-npm'),
  uglify = require('rollup-plugin-uglify');

module.exports = {
  entry: './examples/index.js',
  format: 'umd',
  dest: 'bundle.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    npm({
      jsnext: true,
      main: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    uglify(),
  ],
};
```

**Important Note**: Rollup suggests using `es2015-rollup` preset instead of `es2015` while using Babel 6.

Next, all I needed to do was run the following command:

```sh
rollup -c
```

And on my first few attempts I got errors in following pattern:

```bash
Module ~/react-contextmenu/node_modules/react/react.js does not export Component (imported by ~/react-contextmenu/path/to/somefile.js)
```

Upon inspecting I've found out that this is a problem with the following pattern in general:

```js
import React, { Component } from 'react';
```

I've seen this pattern being used in many react components including my own [react-contextmenu](https://github.com/vkbansal/react-contextmenu) and [react-router](https://github.com/rackt/react-router) v1.0.3.

After fixing the above problem in my package (locally), the problem still persisted in `react-router`. So I decided to turn off the `jsnext` feature. Finally I was able to build the package successfully.

## Moment of truth

The Rollup bundle was ~ 3KB (1%) smaller than that of Webpack's. So In real world (at-least as of publishing this post), I don't find any real advantage of using Rollup.

It will shine only when packages will start supporting ES6 modules. It's caught up in a vicious cycle where package authors will not change their packages to support ES6 modules until Rollup gets widely adopted and Rollup will not get widely adopted until package authors support ES6 modules. Until then I'm sticking with my webpack setup. Moreover, Webpack 2 [will also be supporting tree-shaking](http://www.2ality.com/2015/12/webpack-tree-shaking.html).
