import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader'

import 'src/bootstrap';

import groupWebpackAssets from './utils/group-webpack-assets';
import template from './templates/html.template';
import Routes from './_routes';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
        <BrowserRouter>
            <Component/>
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

export default function(locals) {
    console.log(`Rendering: ${locals.path}`);

    const assets = groupWebpackAssets(locals.webpackStats.toJson().assetsByChunkName);
    const content = ReactDOMServer.renderToStaticMarkup(
        <StaticRouter location={locals.path} context={{}}>
            <Routes posts={locals.posts} />
        </StaticRouter>
    );

    return template({ content, assets });
}
