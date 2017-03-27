import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { format as formatDate } from 'date-fns';
import cx from 'classnames';

import Page from 'src/components/Page';
import Tag from 'src/components/Tag';
import settings from 'settings.yml';
import { getBlogUrls } from 'utils';

import $ from './BlogPost.scss';

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
        const { post, match } = this.props;

        return (
            <Page {...this.props} className={$['blog-post']}>
                <div className={cx('container', $['container'])}>
                    <h1 className={$['title']}>{post.title}</h1>
                    <div className={$['intro']}>By <a href={author.website}>{author.name}</a> on {formatDate(post.date, 'MMMM Do, YYYY')} </div>
                    <div className={$['post']}>
                        <div dangerouslySetInnerHTML={{__html: post.body}} />
                        <div className={$['footer']}>
                            <div className={$['tags']}>
                                {post.tag.map((tag, i) => (
                                    <Tag key={i} url={urls.labelUrl.replace(':label', tag)}>{tag}</Tag>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('container', $['recent-posts-container'])}>
                    <h4>Recent Posts</h4>
                    <ul className={$['recent-posts']}>
                        {this.props.posts.slice(0, 4).filter(post => post.url !== match.url).slice(0, 3).map((recentPost, i) => (
                            <li className={cx('col-4-12', $['recent-post'])} key={i}>
                                <Link to={recentPost.url} className={$['recent-post-link']}>
                                    <h4>{recentPost.title}</h4>
                                    <p className={$['description']}>{recentPost.description}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </Page>
        );
    }
}
