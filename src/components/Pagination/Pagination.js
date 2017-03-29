/* eslint-disable react/no-array-index-key */
import React, { PropTypes } from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import $ from './Pagination.scss';

function Page(props) {
    const { page, currentPage, children, disabled, title, className, url } = props;

    const pageClasses = cx($['page-link'], {
        [$['disabled']]: disabled,
        [$['active']]: page === currentPage
    }, className);

    return disabled
        ? (
            <span className={pageClasses}>
                {children || page}
            </span>
        ) : (
            <Link to={url(page)} className={pageClasses} title={title || page}>
                {children || page}
            </Link>
        );
}

Page.propTypes = {
    page: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    className: PropTypes.string,
    url: PropTypes.oneOf([PropTypes.string, PropTypes.object]).isRequired
};

Page.defaultProps = {
    disabled: PropTypes.bool,
    title: null,
    className: ''
};

function PrevPage(props) {
    const { currentPage } = props;

    return (
        <Page {...props} page={currentPage - 1} disabled={currentPage < 2} title='Prev'>
            &larr; Prev
        </Page>
    );
}

PrevPage.propTypes = {
    currentPage: PropTypes.number.isRequired
};

function NextPage(props) {
    const { currentPage, pages } = props;

    return (
        <Page {...props} page={currentPage + 1} disabled={currentPage + 1 > pages} title='Next'>
            Next &rarr;
        </Page>
    );
}

NextPage.propTypes = {
    currentPage: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired
};

export default function Pagination(props) {
    const { currentPage, pages } = props;

    if (pages < 2) return null;

    if (pages >= 2 && pages <= 9) {
        return (
            <nav className={$['pagination']}>
                <div className={$['pagination-list']}>
                    <PrevPage {...props} className={$['direction']} />
                    <div className={$['page-numbers']}>
                        {Array(pages).fill(0).map((v, i) => <Page key={i} {...props} page={i + 1} />)}
                    </div>
                    <NextPage {...props} className={$['direction']} />
                </div>
            </nav>
        );
    }

    const moreLeft = currentPage > 5;
    const moreRight = pages - currentPage >= 5;

    return (
        <nav className={$['pagination']}>
            <ul className={$['pagination-list']}>
                <PrevPage {...props} />
                {Array(moreLeft ? 2 : 7).fill(0).map((v, i) => <Page key={i} {...props} page={i + 1} />)}
                {moreLeft && <li className={$['more']} />}
                {moreLeft && moreRight
                    && Array(5).fill(0).map((v, i) => <Page key={i} {...props} page={(i + currentPage) - 2} />)}
                {moreRight && <li className={$['more']} />}
                {moreRight
                    ? [pages - 1, pages].map(i => <Page key={i} {...props} page={i} />)
                    : Array(7).fill(0).map((v, i) => <Page key={i} {...props} page={(pages + i) - 6} />)}
                <NextPage {...props} />
            </ul>
        </nav>
    );
}

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired
};
