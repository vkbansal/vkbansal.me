"use strict";

let through = require("through2"),
    path = require("path"),
    gutil = require("gulp-util"),
    utils = require("../utils"),
    cheerio = require("cheerio"),
    SVGOptim = require("svgo");

module.exports = function(options) {

    let svgo = new SVGOptim(),
        sprites = [];

    function transform(file, encoding, done) {
        if (file.isNull()) {
            return done(null, file);
        }

        if (file.isStream()) {
          return done(new gutil.PluginError('posts', 'Streaming not supported'));
        }

        svgo.optimize(file.contents.toString("utf-8"), function(result) {
            if (result.error) {
                return done(new gutil.PluginError('svg-symbol-sprite', result.error));
            }

            sprites.push({
                file: utils.parsePath(file.relative),
                $: cheerio.load(result.data, {xmlMode: true})
            });
        })
        return done();
    }

    function flush(done) {
        let svg$ = cheerio.load("<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"display:none\"></svg>", {xmlMode: true}),
            finalFile;

        sprites.forEach(function({$, file}) {
            let sym$ = cheerio.load("<symbol></symbol>", {xmlMode: true});

            finalFile = file;

            let id = typeof options.id === "string"
                        ? options.id.replace(":basename", file.basename)
                        : file,basename;

            sym$("symbol")
                .attr("viewBox", $("svg").attr("viewBox"))
                .attr("id", id)
                .append($("svg").contents());
            svg$("svg").append(sym$.html());

        });

        this.push(
            utils.createNewFile(
                options.name || "default.svg",
                svg$.html()
            )
        );
        done();
    }

    return through.obj(transform, flush);
}
