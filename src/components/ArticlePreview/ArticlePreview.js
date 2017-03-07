import React from 'react';
import { Link } from 'react-router-dom';
import { format as formatDate } from 'date-fns';
import cx from 'classnames';

import Tag from 'src/components/Tag';
import settings from 'settings.yml';
import { getBlogUrls } from 'utils';

import styles from './ArticlePreview.scss';

const { blog } = settings;
const urls = getBlogUrls(blog);

function ArticlePreview({post, className, showTags}) {
    return (
        <div className={cx(styles['article-preview'], className)}>
            <p className={styles['meta']}>{formatDate(post.date, 'MMMM Do, YYYY')}</p>
            <Link to={post.url} className={styles['link']}>
                <h2 className={styles['title']}>{post.title}</h2>
                <p className={styles['description']}>{post.description}</p>
                <p className={styles['read-more']}>Read more…</p>
            </Link>
            {showTags && (
                <div className={styles['tags']}>
                    {post.tag.map((tag, i) => (
                        <Tag key={i} url={urls.labelUrl.replace(':label', tag)}>{tag}</Tag>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ArticlePreview;