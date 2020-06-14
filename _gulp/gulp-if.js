const through = require('through2');

module.exports = function (condition, trueStream, falseStream = through.obj()) {
  return condition ? trueStream : falseStream;
};
