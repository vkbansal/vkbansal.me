---
title: SQLite in Browser using WebAssembly
description: Experimenting with WebAssembly. Trying to run SQLite in Browser.
author:
    name: Vivek Kumar Bansal
    site: http://vkbansal.me
date: 2019-09-15
tag:
    - sqlite
    - wasm
    - experiments
---

In recent times, I have been hearing quite a lot about [WebAssembly](https://webassembly.org/) and I
wanted to experiment with it. For those of you who do know what WebAssembly is, let me put is this way,
it is a binary format which allows us to run native code written in C/C++/Rust inside a browser.
This technology has a lot of potential.

For Instance, [Autodesk](https://en.wikipedia.org/wiki/Autodesk), the company behind [AutoCAD](https://en.wikipedia.org/wiki/AutoCAD),
has already started investing in it. You can now run [AutoCAD in your browser](https://web.autocad.com/)!
Yes you read it right. I repeat **"YOU CAN NOW RUN AUTOCAD IN YOUR BROWSER!"**

This is the current support for WebAssembly.

<iframe src="https://caniuse.bitsofco.de/embed/index.html?feat=wasm&amp;periods=future_1,current,past_1,past_2&amp;accessible-colours=false" frameborder="0" width="100%" height="420px" kwframeid="9"></iframe>

I wanted to experiment with WebAssembly myself and started to research (read google 😉) about it.
I was looking to use some native library that I'm already familiar with. This is when, I came across [sql.js](https://github.com/kripken/sql.js/).
It is [SQLite](https://www.sqlite.org/index.html) compiled to WebAssembly and can be used via JavaScript
and I was able to run it successfully!

For the impatient ones, [here is the demo](https://vkbansal.github.io/sqlite-wasm-demo/) and [here is the source code](https://github.com/vkbansal/sqlite-wasm-demo).
I want to emphasis that, this is just an experiment and I would not recommend to use this in production.

## The setup

I'll be showing, how to setup `sql.js` using `webpack`. I've used `react` for the UI in my demo, but you
can use any framework of your choice. I'll not go trough the UI code that I have in the the demo.
I'll be explaining just the setup process of `sql.js`.

I'm will be using `webpack@4.40.2` and `sql.js@1.0.0`(the latest versions available at the time of writing this).

Let's get started with the setup. First of all, you'll need to install `sql.js`.

```bash
mkdir sqlite-wasm-demo
cd sqlite-wasm-demo
yarn add sql.js webpack
```

`sql.js` comes with two builds, a debug build and a production build. The debug build can be found
at `sql.js/dist/sql-wasm-debug.js` and the production build can be found at `sql.js/dist/sql-wasm.js`.
These files require `sql.js/dist/sql-wasm-debug.wasm` and `sql.js/dist/sql-wasm.wasm` respectively
to be present, in order to work.

For ease of switching between the debug build and the production build, we can setup an alias for `sql.js`
using webpack aliases.

```js
// webpack.confis.js
const path = require('path');
const PROD = process.env.NODE_ENV === 'production';
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    // rest of the config...
    resolve: {
        alias: {
            'sql.js': PROD
                ? path.resolve(process.cwd(), './node_modules/sql.js/dist/sql-wasm.js')
                : path.resolve(process.cwd(), './node_modules/sql.js/dist/sql-wasm-debug.js')
        }
    }
    // rest of the config...
};
```

You'll also need to copy the corresponding `.wasm` file to the output folder. For this, I've use `copy-webpack-plugin`.

```bash
yarn add copy-webpack-plugin
```

```js
// webpack.confis.js
const path = require('path');
const PROD = process.env.NODE_ENV === 'production';

module.exports = {
    // rest of the config...
    plugins: [
        new CopyWebpackPlugin([
            {
                from: PROD
                    ? './node_modules/sql.js/dist/sql-wasm.wasm'
                    : './node_modules/sql.js/dist/sql-wasm-debug.wasm',
                to: './'
            }
        ])
    ]
    // rest of the config...
};
```

Now you can invoke, `sql.js` from your code.

```js
// somewhere in your app
import initSqlJs from 'sql.js';

async function initApp(params) {
    const SQL = await initSqlJs();
    const db = new SQL.DATABASE();

    // no you can use sqlite!
    db.exec('SELECT 1;');
}

initApp();
```

This should get you started with SQLite in the browser. The most common issue you might face, will most probably
related to the path of `.wasm` files. It might depend on how you have configured your `webpack`. For most part,
copying it to the same path as your entry `.js` file should work.

In [the demo](https://vkbansal.me/sqlite-wasm-demo/), I've include some data from [fanzeyi/pokemon.json](https://github.com/fanzeyi/pokemon.json)
for you to play around. You can see the info about the tables by clicking on "Available tables" in the demo page.

I hope you find this exciting. If you have experimented with WebAssembly yourself and want to share your experience with me,
you can tweet me [@\_vkbansal](https://twitter.com/_vkbansal)
