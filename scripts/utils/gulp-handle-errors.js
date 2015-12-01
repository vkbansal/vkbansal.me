"use strict";

let notify = require('gulp-notify'),
    gutil = require('gulp-util'),
    chalk = require('chalk');

module.exports = function () {
    let args = Array.prototype.slice.call(arguments);

    gutil.log(chalk.bgRed(`${arguments[0].plugin} : ${arguments[0].message}`));
    //Send error to notification center with gulp-notify
    notify.onError({
        title: arguments[0].plugin,
        message: "<%= error.message %>"
    }).apply(this, args);

    //Keep gulp from hanging on this task
    this.emit('end');
}
