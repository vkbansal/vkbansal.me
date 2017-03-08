import React, { Component, PropTypes } from 'react';
import { format as formatDate } from 'date-fns';
import cx from 'classnames';

import Page from 'src/components/Page';
import Tag from 'src/components/Tag';
import settings from 'settings.yml';
import { getBlogUrls } from 'utils';

import styles from './BlogPost.scss';

const { author, blog } = settings;
const urls = getBlogUrls(blog);

export default function BlogPost(props) {
    const { post } = props;

    return (
        <Page {...props} className={styles['blog-post']}>
            <div className={cx('container', styles['container'])}>
                <div className={styles['post']}>
                    <h1 className={styles['title']}>{post.title}</h1>
                    <div className={styles['intro']}>By <a href={author.website}>{author.name}</a> on {formatDate(post.date, 'MMMM Do, YYYY')} </div>
                    <div dangerouslySetInnerHTML={{__html: post.body}} />
                    <div className={styles['footer']}>
                        <div className={styles['tags']}>
                            {post.tag.map((tag, i) => (
                                <Tag key={i} url={urls.labelUrl.replace(':label', tag)}>{tag}</Tag>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles['sidebar']}>
                    <h4>Recent Posts</h4>
                    <ul>
                        {props.posts.slice(0, 5).map((recentPost) => (
                            <li>{recentPost.title}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </Page>
    );
}
