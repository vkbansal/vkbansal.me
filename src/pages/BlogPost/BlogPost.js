import React, { Component, PropTypes } from 'react';

import Page from 'src/components/Page';

export default function BlogPost(props) {
    const { post } = props;

    return (
        <Page {...props}>
            <div className='container'>
                <div dangerouslySetInnerHTML={{__html: post.body}} />
            </div>
        </Page>
    );
}
