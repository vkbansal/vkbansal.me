/* eslint-disable import/no-commonjs */
const config = ({ modules = false } = {}) => ({
    presets: [
        'react',
        ['env', {
            targets: {
                node: 'current'
            },
            modules,
            loose: true
        }]
    ],
    plugins: [
        'transform-class-properties',
        'syntax-dynamic-import',
        'transform-object-rest-spread'
    ]
});

module.exports = {
    node: config({ modules: 'commonjs' }),
    webpack: config()
};
