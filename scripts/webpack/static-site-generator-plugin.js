const RawSource = require('webpack-sources/lib/RawSource');
const evaluate = require('eval');
const path = require('path');
const Promise = require('bluebird');

function findAsset(src, compilation, webpackStatsJson) {
    if (!src) {
        let chunkNames = Object.keys(webpackStatsJson.assetsByChunkName);

        src = chunkNames[0];
    }

    const asset = compilation.assets[src];

    if (asset) {
        return asset;
    }

    let chunkValue = webpackStatsJson.assetsByChunkName[src];

    if (!chunkValue) {
        return null;
    }
    // Webpack outputs an array for each chunk when using sourcemaps
    if (Array.isArray(chunkValue)) {
        // Is the main bundle always the first element?
        chunkValue = chunkValue[0];
    }
    return compilation.assets[chunkValue];
};

// Shamelessly stolen from html-webpack-plugin - Thanks @ampedandwired :)
function getAssetsFromCompilation(compilation, webpackStatsJson) {
    let assets = {};

    for (let chunk in webpackStatsJson.assetsByChunkName) {
        let chunkValue = webpackStatsJson.assetsByChunkName[chunk];

        // Webpack outputs an array for each chunk when using sourcemaps
        if (Array.isArray(chunkValue)) {
            // Is the main bundle always the first element?
            chunkValue = chunkValue[0];
        }

        if (compilation.options.output.publicPath) {
            chunkValue = compilation.options.output.publicPath + chunkValue;
        }
        assets[chunk] = chunkValue;
    }

    return assets;
};

class StaticSiteGeneratorWebpackPlugin {
    constructor (options = {}) {
        this.entry = options.entry;
        this.paths = Array.isArray(options.paths) ? options.paths : [options.paths || '/'];
        this.locals = options.locals;
        this.globals = options.globals;

        this.apply = this.apply.bind(this);
    }

    apply(compiler) {
        compiler.plugin('this-compilation', (compilation) => {
            compilation.plugin('optimize-assets', (_, done) => {
            const webpackStats = compilation.getStats();
            const webpackStatsJson = webpackStats.toJson();

            try {
                const asset = findAsset(this.entry, compilation, webpackStatsJson);

                if (asset == null) {
                    throw new Error('Source file not found: "' + this.entry + '"');
                }

                const assets = getAssetsFromCompilation(compilation, webpackStatsJson);

                const source = asset.source();
                let render = evaluate(source, /* filename: */ this.entry, /* scope: */ this.globals, /* includeGlobals: */ true);

                if (render.hasOwnProperty('default')) {
                    render = render['default'];
                }

                if (typeof render !== 'function') {
                    throw new Error(`Export from ${this.entry} must be a function that returns an HTML string, but got ${JSON.stringify(render)}`);
                }

                const renderPromises = this.paths.map((outputPath) => {
                    let outputFileName = outputPath.replace(/^(\/|\\)/, ''); // Remove leading slashes for webpack-dev-server

                    if (!/\.(html?)$/i.test(outputFileName)) {
                        outputFileName = path.join(outputFileName, 'index.html');
                    }

                    let locals = {
                        path: outputPath,
                        assets: assets,
                        webpackStats: webpackStats
                    };

                    for (let prop in this.locals) {
                        if (this.locals.hasOwnProperty(prop)) {
                            locals[prop] = this.locals[prop];
                        }
                    }

                    var renderPromise = render.length < 2 ?
                        Promise.resolve(render(locals)) :
                        Promise.fromNode(render.bind(null, locals));

                    return renderPromise
                        .then(function(output) {
                        compilation.assets[outputFileName] = new RawSource(output);
                        })
                        .catch(function(err) {
                        compilation.errors.push(err.stack);
                        });
                });

                Promise.all(renderPromises).nodeify(done);
            } catch (err) {
                compilation.errors.push(err.stack);
                done();
            }
            });
        });
    }
}

module.exports = StaticSiteGeneratorWebpackPlugin;
