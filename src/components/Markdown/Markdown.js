import React, { Component, PropTypes } from 'react';

import markdown from 'markdown-it';
import decorate from 'markdown-it-decorate';

const md = markdown({
    html: true
}).use(decorate);

class Markdown extends Component {
    static propTypes = {
        children: PropTypes.string.isRequired
    };

    render() {
        let { className = '', children } = this.props;

        if (typeof children !== 'string') children = String(children);

        return (
            <div className={className} dangerouslySetInnerHTML={{__html: md.render(children)}} />
        );
    }
}

export default Markdown;
