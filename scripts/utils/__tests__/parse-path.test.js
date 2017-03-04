const parsePath = require('../parse-path');

describe('Parse path tests', () => {
    test('parse blog path for file', () => {
        const data = parsePath('pages/blog/machine-learning/2016-05-01-linear-regression-with-one-variable.md');
        const data2 = parsePath('pages/blog/2017-02-26-pie-donut-chart-without-d3/readme.md')

        expect(data).toMatchObject({
            slug: 'linear-regression-with-one-variable',
            url: '/blog/machine-learning/linear-regression-with-one-variable',
            isPost: true
        });

        expect(data2).toMatchObject({
            slug: 'pie-donut-chart-without-d3',
            url: '/blog/pie-donut-chart-without-d3',
            isPost: true
        });
    });

    test('parse blog path for dir', () => {
        const data = parsePath('pages/blog/machine-learning/2016-05-01-linear-regression-with-one-variable/readme.md');
        const data2 = parsePath('pages/blog/2015-01-02-hello-world-2015.md')

        expect(data).toMatchObject({
            url: '/blog/machine-learning/linear-regression-with-one-variable',
            slug: 'linear-regression-with-one-variable',
            isPost: true
        });

        expect(data2).toMatchObject({
            url: '/blog/hello-world-2015',
            slug: 'hello-world-2015',
            isPost: true
        });
    });

    test('parse page path for file', () => {
        const data = parsePath('pages/about.js');
        const data2 = parsePath('pages/about.md');

        expect(data).toMatchObject({
            url: '/about'
        });

        expect(data2).toMatchObject({
            url: '/about'
        });
    });

    test('parse page path for dir', () => {
        const data = parsePath('pages/about/index.js');
        const data2 = parsePath('pages/index.js');
        const data3 = parsePath('pages/about/readme.md');

        expect(data).toMatchObject({
            url: '/about'
        });

        expect(data2).toMatchObject({
            url: '/'
        });

         expect(data3).toMatchObject({
            url: '/about'
        });
    });
});
