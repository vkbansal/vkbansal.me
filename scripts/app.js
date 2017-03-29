import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';

import 'src/bootstrap';
import settings from 'settings.yml';

import groupWebpackAssets from './utils/group-webpack-assets';
import Routes from './_routes';
import posts from './_posts.json';

const PROD = process.env.NODE_ENV === 'production';

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <BrowserRouter>
                <Component />
            </BrowserRouter>
        </AppContainer>,
        document.getElementById('root')
    );
};
if (typeof document !== 'undefined') {
    render(Routes);

    if (module.hot) {
        module.hot.accept('./_routes', () => render(Routes));
    }
}

const postsMap = new Map(posts.map(post => [post.url, post]));

export default function (locals) {
    console.log(`Rendering: ${locals.path}`);

    const content = ReactDOMServer.renderToStaticMarkup(
        <StaticRouter location={locals.path} context={{}}>
            <Routes />
        </StaticRouter>
    );

    const postData = postsMap.get(locals.path) || {};

    const data = {
        content,
        assets: groupWebpackAssets(locals.webpackStats.toJson().assetsByChunkName),
        settings,
        PROD,
        postData
    };

    return locals.template(data);
}
