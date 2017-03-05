import React, { Component, PropTypes } from 'react';

export default class BlogPost extends Component {
    static defaultProps = {
        post: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            body: props.body || ''
        };
        this.data = {};
    }

    render() {
        const { body } = this.props.post;

        return <div dangerouslySetInnerHTML={{__html: body}} />;
    }
}
