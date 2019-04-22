import { getURL } from '../miscUtils';

describe('buid test', () => {
    describe('getURL tests', () => {
        const case1 = [
            ['pages', 'index', '/'],
            ['pages/about', 'index', '/about/'],
            ['pages/about', 'readme', '/about/'],
            [
                'pages/blog/2016/machine-learning',
                'linear-regression-with-multiple-variables',
                '/blog/machine-learning/linear-regression-with-multiple-variables/'
            ],
            ['pages/blog/2015', 'hello-world-2015', '/blog/hello-world-2015/'],
            [
                'pages/blog/2016/machine-learning/linear-regression-with-one-variable',
                'readme',
                '/blog/machine-learning/linear-regression-with-one-variable/'
            ],
            [
                'pages/blog/2017/pie-donut-chart-without-d3',
                'readme',
                '/blog/pie-donut-chart-without-d3/'
            ]
        ];

        test.each(case1)('parse url: "%s" + "%s" => "%s"', (dir, file, expected) => {
            expect(getURL(dir, file)).toBe(expected);
        });
    });
});
