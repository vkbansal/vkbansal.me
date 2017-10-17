import React from 'react';
import PropTypes from 'prop-types';

import Header from 'src/components/Header';
import Footer from 'src/components/Footer';

function Page(props) {
    const { children, className, ...rest } = props;

    return (
        <div className={className}>
            <Header {...rest} />
            {children}
            <Footer />
        </div>
    );
}

Page.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

Page.defaultProps = {
    className: ''
};

export default Page;
