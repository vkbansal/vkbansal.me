// eslint-disable react/no-array-index-key
import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import styles from './Pagination.scss';

const pageClasses = (page, currentPage = 1, disabled, className) => cx(styles['page-link'], {
    [styles['active']]: page === currentPage && !disabled,
    [styles['disabled']]: disabled
}, className);

function Page(props) {
    const {page, currentPage, children, disabled, title, className, url} = props;

    return disabled
        ? (
            <span className={pageClasses(page, currentPage, disabled, className)}>
                {children || page}
            </span>
        ) : (
            <Link to={url(page)} className={pageClasses(page, currentPage, disabled, className)} title={title || page}>
                {children || page}
            </Link>
        );
}

function PrevPage(props) {
    const { currentPage } = props;

    return (
        <Page {...props} page={currentPage - 1} disabled={currentPage < 2} title='Prev'>
            &larr; Prev
        </Page>
    );
}

function NextPage(props) {
    const { currentPage, pages } = props;

    return (
        <Page {...props} page={currentPage + 1} disabled={currentPage + 1 > pages} title='Next'>
            Next &rarr;
        </Page>
    );
}

export default function Pagination(props) {
    const { currentPage, pages } = props;

    if (pages < 2) return null;

    if (pages >= 2 && pages <= 9) {
        return (
            <nav className={styles['pagination']}>
                <div className={styles['pagination-list']}>
                    <PrevPage {...props} className={styles['direction']}/>
                    <div className={styles['page-numbers']}>
                        {Array(pages).fill(0).map((v, i) => <Page key={i} {...props} page={i + 1} />)}
                    </div>
                    <NextPage {...props} className={styles['direction']}/>
                </div>
            </nav>
        );
    }

    const moreLeft = currentPage > 5;
    const moreRight = pages - currentPage >= 5;

    return (
        <nav className={styles['pagination']}>
            <ul className={styles['pagination-list']}>
                <FirstPage {...props} />
                <PrevPage {...props} />
                {Array(moreLeft ? 2 : 7).fill(0).map((v, i) => <Page key={i} {...props} page={i + 1} />)}
                {moreLeft ? <li className={styles['more']} /> : null}
                {moreLeft && moreRight
                    ? Array(5).fill(0).map((v, i) => <Page key={i} {...props} page={i + currentPage - 2} />)
                    : null}
                {moreRight ? <li className={styles['more']} /> : null}
                {moreRight
                    ? [pages - 1, pages].map((i) => <Page key={i} {...props} page={i} />)
                    : Array(7).fill(0).map((v, i) => <Page key={i} {...props} page={pages + i - 6} />)}
                <NextPage {...props} />
                <LastPage {...props} />
            </ul>
        </nav>
    );
}
