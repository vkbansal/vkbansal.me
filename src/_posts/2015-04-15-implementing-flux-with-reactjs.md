---
draft: true
---
# Implementing Flux with ReactJS
Flux is an application architecture developed by facebook for building client-side web application utilizing a unidirectional data flow. As the [flux website](http://facebook.github.io/flux/) states: it's more of pattern rather than a formal framework. You can head over to their website to learn more about it.

With increase in popularity of ReactJS, there was a explosion in the amount of packages for implementing flux. After a lot of research, I setteled down with [Alt](http://alt.js.org/). The main selling point of alt for me was less amount of boiler-plate code and ES6.

## What we will be building
We'll be building a very simple TODO list (I like to call it the new "Hello World" of JavaScript). You can have a look at [live demo](http://vkbansal.github.io/learn-flux/).


## TL;DR
If you don't want to read the entire tutorial, you can [download the source code](https://github.com/vkbansal/learn-flux/archive/master.zip). You'll need Node.js/io.js, npm and gulp to run it.
Assuming that you have, here is what you need to do:

1. Download the [zip file](https://github.com/vkbansal/learn-flux/archive/master.zip) with the source code.
2. Extract it to a folder somewhere on your computer.
3. Open terminal/command-prompt, and navigate to that folder.
4. Run `npm install`. This will download and install all dependencies that are needed.

Run `gulp` to bundle the app (using browserify) and watch for changes and start a server at `http://localhost:8000`.

> Note: The source code uses ES6 and JSX syntax. See [babeljs](https://babeljs.io/).

The source code is easy to follow, so for those of you who prefer to read the source, you can skip the rest of the article.

## Setting things up
As I mentioned above, we will be using ES6 and JSX for writting React code. There are many tools out there, for the job but my personal choice is [babelify](https://github.com/babel/babelify) -- a [browserify](https://github.com/substack/node-browserify) transform. This gives us the goodness of ES6, JSX and node.js style `require()` and the ability to intsall and utilize the awesome collection of libraries from npm.

1. Copy `package.json` and `gulpfile.js` from the zip file to you folder and run `npm install`.
2. Create a `src` folder. All our code will go inside this directory.
2. As stated above, run `gulp` to bundle the app (using browserify) and watch for changes and start a server at `http://localhost:8000`.

Now lets write some code.

## The Code
Here is the directory stucture, we will be using.

```none
src
├── actions
|   └── task-actions.js
├── components
|   ├──
|   └──
├── mixins
|   └── alt-mixin.js
├── stores
|   └── task-store.js
├── alt.js
└── app.js

```

## Getting Started
First we need to create an instance of `Alt`.
```javascript
//alt.js
let Alt = require('alt');

module.exports = new Alt();
```
Next we'll create an entry point for our app.
```js
//app.js

```
