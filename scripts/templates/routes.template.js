// Not to be used directly
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { map } from 'lodash';

import BlogPost from 'src/pages/BlogPost';
/*${postImports}*/

import posts from './_posts.json';
import pages from './_pages.json';
import tags from './_tags.json';

const PROD = process.env.NODE_ENV === 'production';

const pageImports = {/*${postImportsMap}*/};

const pageRoutes = {/*${pageImportsMap}*/};

export default function Root(parentProps) {
    return (
        <Switch>
            {map(pageRoutes, (Component, key) => (
                <Route key={key} path={key} exact
                    render={(props) => (
                    <Component {...parentProps} {...props} posts={posts} tags={tags} pages={pages} />
                )}/>
            ))}
            <Route path='/blog/:slug' exact
                render={(props) => (
                    <BlogPost {...parentProps} {...props} posts={posts} tags={tags} pages={pages}
                        post={pageImports[props.match.params.slug]}/>
                )} />
        </Switch>
    );
}
