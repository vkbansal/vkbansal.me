// Not to be used directly
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { map } from 'lodash';

import BlogPost from 'src/pages/BlogPost';
/*${postImports}*/

const PROD = process.env.NODE_ENV === 'production';

const pageImports = {/*${postImportsMap}*/};

const pageRoutes = {/*${pageImportsMap}*/};

export default function Root(parentProps) {
    return (
        <Switch>
            {map(pageRoutes, (Component, key) => (
                <Route key={key} path={key} exact
                    render={(props) => (
                    <Component {...parentProps} {...props} />
                )}/>
            ))}
            <Route path='/blog/:slug' exact
                render={(props) => (
                    <BlogPost {...parentProps} {...props} post={pageImports[props.match.params.slug]}/>
                )} />
        </Switch>
    );
}
