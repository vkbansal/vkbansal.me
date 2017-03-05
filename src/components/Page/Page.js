import React, { Component } from 'react';

import Header from 'src/components/Header';

class Page extends Component {
    render() {
        const { children, className = '', ...rest } = this.props;

        return (
            <div className={className}>
                <Header {...rest} />
                {children}
            </div>
        );
    }
}

export default Page;
