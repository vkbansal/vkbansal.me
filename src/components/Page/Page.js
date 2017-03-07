import React, { Component } from 'react';

import Header from 'src/components/Header';
import Footer from 'src/components/Footer';

class Page extends Component {
    render() {
        const { children, className = '', ...rest } = this.props;

        return (
            <div className={className}>
                <Header {...rest} />
                {children}
                <Footer />
            </div>
        );
    }
}

export default Page;
