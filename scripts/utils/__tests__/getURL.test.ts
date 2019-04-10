import { getURL } from '../miscUtils';

describe('buid test', () => {
    describe('getURL tests', () => {
        test('parse page path for dir', () => {
            expect(getURL('pages', 'index')).toBe('/');
            expect(getURL('pages/about', 'index')).toBe('/about');
            expect(getURL('pages/about', 'readme')).toBe('/about');
        });

        test('parse page path for file', () => {
            expect(getURL('pages', 'about')).toBe('/about');
            expect(getURL('pages', 'about')).toBe('/about');
            expect(getURL('pages/about', 'resume')).toBe('/about/resume');
        });

        test('parse blog path for file', () => {
            expect(
                getURL(
                    'pages/blog/machine-learning',
                    '2016-05-04-linear-regression-with-multiple-variables'
                )
            ).toBe('/blog/machine-learning/linear-regression-with-multiple-variables');
            expect(getURL('pages/blog', '2015-01-02-hello-world-2015')).toBe(
                '/blog/hello-world-2015'
            );
        });

        test('parse blog path for dir', () => {
            expect(
                getURL(
                    'pages/blog/machine-learning/2016-05-01-linear-regression-with-one-variable',
                    'readme'
                )
            ).toBe('/blog/machine-learning/linear-regression-with-one-variable');
            expect(getURL('pages/blog/2017-02-26-pie-donut-chart-without-d3', 'readme')).toBe(
                '/blog/pie-donut-chart-without-d3'
            );
        });

        test('throws for ivalid post', () => {
            expect(() => getURL('page', '2015-01-02-hello-world-2015')).toThrow();
        });
    });
});
