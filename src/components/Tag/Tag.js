import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import PropTypes from 'prop-types';

import styles from './Tag.scss';

export default function Tag(props) {
    const className = cx(styles['tag'], props.className);

    return props.url
        ? (
            <Link to={props.url} className={className}>
                {props.children || props.name}
            </Link>
        ) : (
            <span className={className}>
                {props.children || props.name}
            </span>
        );
}

Tag.propTypes = {
    url: PropTypes.oneOf([PropTypes.string, PropTypes.object]).isRequired,
    name: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string
};

Tag.defaultProps = {
    name: '',
    children: null,
    className: ''
};
