const config = ({modules = false} = {}) => ({
    "presets": [
        "react",
        ["env", {
            "targets": {
                "node": "current"
            },
            "modules": modules,
            "loose": true
        }]
    ],
    "plugins": [
        "transform-class-properties",
        "syntax-dynamic-import",
        "transform-object-rest-spread"
    ]
});

module.exports = {
    node: config({modules: 'commonjs'}),
    webpack: config()
}
