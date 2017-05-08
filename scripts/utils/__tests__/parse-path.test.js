import settings from '../../settings';
import parsePath from '../parse-path';

const postFilePath = fileName => `pages/${settings.blog.prefix}/${fileName}`;
const blogPath = fileName => `/${settings.blog.prefix}/${fileName}`;

jest.mock('fs-extra');

describe('Parse path tests', () => {
    test('parse blog path for file', async () => {
        const data = await parsePath(postFilePath('machine-learning/2016-05-04-linear-regression-with-multiple-variables.md'));
        const data2 = await parsePath(postFilePath('2017-02-26-pie-donut-chart-without-d3/readme.md'));

        expect(data).toMatchObject({
            slug: 'linear-regression-with-multiple-variables',
            url: blogPath('machine-learning/linear-regression-with-multiple-variables'),
            isPost: true
        });

        expect(data2).toMatchObject({
            slug: 'pie-donut-chart-without-d3',
            url: blogPath('pie-donut-chart-without-d3'),
            isPost: true
        });
    });

    test('parse blog path for dir', async () => {
        const data = await parsePath(postFilePath('machine-learning/2016-05-01-linear-regression-with-one-variable/readme.md'));
        const data2 = await parsePath(postFilePath('2015-01-02-hello-world-2015.md'));

        expect(data).toMatchObject({
            url: blogPath('machine-learning/linear-regression-with-one-variable'),
            slug: 'linear-regression-with-one-variable',
            isPost: true
        });

        expect(data2).toMatchObject({
            url: blogPath('hello-world-2015'),
            slug: 'hello-world-2015',
            isPost: true
        });
    });

    test('parse page path for file', async () => {
        const data = await parsePath('pages/about.js');
        const data2 = await parsePath('pages/about.md');

        expect(data).toMatchObject({
            url: '/about'
        });

        expect(data2).toMatchObject({
            url: '/about'
        });
    });

    test('parse page path for dir', async () => {
        const data = await parsePath('pages/about/index.js');
        const data2 = await parsePath('pages/index.js');
        const data3 = await parsePath('pages/about/readme.md');

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
