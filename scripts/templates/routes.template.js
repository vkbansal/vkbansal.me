// Not to be used directly
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { map } from 'lodash';

import BlogPost from 'src/pages/BlogPost';
import Page from 'src/components/Page';
/*${postImports}*/

import posts from './_posts.json';
import pages from './_pages.json';
import tags from './_tags.json';

const PROD = process.env.NODE_ENV === 'production';

const pageImports = {/*${postImportsMap}*/};

const pageJSRoutes = {/*${pageJSImportsMap}*/};

const pageMarkdownRoutes = {/*${pageMarkdownImportsMap}*/};

const postsMap = new Map(posts.map((post) => [post.slug, post]));

export default function Root(parentProps) {
    return (
        <Switch>
            {map(pageJSRoutes, (Component, key) => (
                <Route key={key} path={key} exact
                    render={(props) => (
                    <Component {...parentProps} {...props} posts={posts} tags={tags} pages={pages} />
                )}/>
            ))}
            {map(pageMarkdownRoutes, (page, key) => (
                <Route key={key} path={key} exact
                    render={(props) => (
                        <Page {...props} >
                            <div className='container' dangerouslySetInnerHTML={{__html: page.body}}/>
                        </Page>
                )}/>
            ))}
            <Route path='/blog/:slug' exact
                render={(props) => {
                    const { slug } = props.match.params;
                    const data = postsMap.get(slug) || {};

                    return (
                        <BlogPost {...parentProps} {...props} posts={posts} tags={tags} pages={pages}
                            post={{ ...data, ...pageImports[slug]}}/>
                    );
                }} />
        </Switch>
    );
}
