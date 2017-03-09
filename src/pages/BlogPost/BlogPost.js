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

export default class BlogPost extends Component {
    componentDidMount() {
        if (this.props.post.math) {
            let script = document.getElementById('mathjax-script');

            if (script) return;

            let head = document.getElementsByTagName('head')[0];
            script = document.createElement('script');
            script.type = 'text/x-mathjax-config';
            script[(window.opera ? 'innerHTML' : 'text')] =
                'MathJax.Hub.Config({\n' +
                '  tex2jax: { inlineMath: [["$","$"], ["\\\\(","\\\\)"]] }\n' +
                '});';
            head.appendChild(script);
            script = document.createElement('script');
            script.id = 'mathjax-script';
            script.type = 'text/javascript';
            script.src  = settings.scripts.mathjax;
            head.appendChild(script);
        }
    }

    render() {
        const { post } = this.props;

        return (
            <Page {...this.props} className={styles['blog-post']}>
                <div className='container'>
                    <h1 className={styles['title']}>{post.title}</h1>
                    <div className={styles['intro']}>By <a href={author.website}>{author.name}</a> on {formatDate(post.date, 'MMMM Do, YYYY')} </div>
                </div>
                <div className={cx('container', styles['container'])}>
                    <div className={styles['post']}>
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
                            {this.props.posts.slice(0, 5).map((recentPost, i) => (
                                <li key={i}>{recentPost.title}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Page>
        );
    }
}
