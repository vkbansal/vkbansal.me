/* eslint-disable react/no-danger */
import React, { PropTypes } from 'react';
import markdown from 'markdown-it';
import decorate from 'markdown-it-decorate';

const md = markdown({
    html: true
}).use(decorate);

function Markdown({ className, children }) {
    if (typeof children !== 'string') children = String(children); // eslint-disable-line no-param-reassign

    return (
        <div className={className} dangerouslySetInnerHTML={{ __html: md.render(children) }} />
    );
}

Markdown.propTypes = {
    className: PropTypes.string,
    children: PropTypes.string.isRequired
};

Markdown.defaultProps = {
    className: ''
};

export default Markdown;
