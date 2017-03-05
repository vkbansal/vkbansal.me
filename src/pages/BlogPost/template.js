export default function (page) {
    `
import React, { Component, PropTypes } from 'react';
import post from '${page.filepath}';

export default class BlogPost extends Component {
    render() {
        return <div dangerouslySetInnerHTML={{__html: post.body}} />;
    }
}`

}
