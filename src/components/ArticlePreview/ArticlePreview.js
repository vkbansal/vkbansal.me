import React from 'react';
import { Link } from 'react-router-dom';
import { format as formatDate } from 'date-fns';
import cx from 'classnames';

import Tag from 'src/components/Tag';

import styles from './ArticlePreview.scss';

function ArticlePreview({post, className, showTags}) {
    return (
        <Link to={post.url} className={cx(styles['article-preview'], className)}>
            <p className={styles['meta']}>{formatDate(post.date, 'MMMM Do, YYYY')}</p>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            {showTags && (
                <div className={styles['tags']}>
                    {post.tag.map((tag, i) => (
                        <Tag key={i}>{tag}</Tag>
                    ))}
                </div>
            )}
        </Link>
    );
}

export default ArticlePreview;
