---
title: How to write a gulp plugin
description: A quick look at writing a gulp plugin
date: 2016-03-29
author:
    name: Vivek Kumar Bansal
    site: http://vkbansal.me
tag:
  - gulp
  - gulp-plugin
  - javascript
---

# How to write a gulp plugin

[Gulp](http://gulpjs.com/) is task runner that uses node's [streams](https://nodejs.org/api/stream.html) for file manipulation. It is very fast as it does not write intermidiary files and everything happens in memory. It prefers code over configuration and it can be extended very easily via plugins. There are hundreds of plugins already available for it via [npm](https://www.npmjs.com/browse/keyword/gulpplugin) and It is very easy to write one.

## Let's stream

A gulp plugin must return a [stream](https://nodejs.org/api/stream.html) in [object mode](https://nodejs.org/api/stream.html#stream_object_mode) which takes a [vinyl file](http://github.com/wearefractal/vinyl) object and returns a [vinyl file](http://github.com/wearefractal/vinyl) object. This is know as [transform streams](https://nodejs.org/api/stream.html#stream_class_stream_transform_1).

The most basic way to write  a plugin by using node's inbuilt [transform streams](https://nodejs.org/api/stream.html#stream_class_stream_transform_1) as shown below.

```js
import Transform from "transform";

export default function() {

  let transformStream = new Transform({objectMode: true});

  transformStream._transform = function(file, encoding, callback) {
    let error = null,
        output = doSomeThingWithFile(file);

    callback(error, output);
  };

  transformStream._flush = function(callback) {
    callback();
  };

  return transformStream;
}
```

The important thing here is to  implement `_transform` function on the transform object as it performs the actual transformation. The  `_flush`  function is optional and if defined, it is called at the end of the stream but before emiting an `end` signal.

`transform.push` can be used zero or more times in either of the methods to add more data to the stream, which means that the following methods are equivalent.

```javascript
transformStream._transform = function(file, encoding, callback) {
  let error = null,
      output = doSomeThingWithFile(file);

  callback(error, output);
};

transformStream._transform = function(file, encoding, callback) {
  let error = null,
      output = doSomeThingWithFile(file);

  this.push(output);
  callback(error);
};
```

## Through2

Another very popular method of writing a plugin is using [through2](https://www.npmjs.com/package/through2), as shown below.

```js
import through from "through2";

export default function() {
  let transform = function(file, encoding, callback) {
    let error = null,
        output = doSomeThingWithFile(file);

    callback(error, output);
  };

  let flush = function(callback) {
    callback();
  };

  return through.obj(transform, flush);
}
```

In this case also, `this.push` can be called zero or more times to add new/extra data to the stream.

## Example

Below is a simple plugin that will convert Markdown syntax to HTML using `markdown-it`.

```javascript
import through from "through2";
import gutil from "gulp-util";
import md from "markdown-it";

export default function() {
  let transform = function(file, encoding, callback) {
  	if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      let error = new gutil.PluginError('myPlugin', 'Streaming not supported');
      return callback(error);
    }

    let contents = file.contents.toString("utf8");

    let output = md({html: true}).render(contents);

    file.contents = new Buffer(output);

    callback(null, file);
  };

  return through.obj(transform);
}
```

**Note**: Here we are making use of `Buffer`(s) and not `Stream`(s).

Now that you've seen, how to write a gulp plugin, your imagination is the limit for what you can do with it.
