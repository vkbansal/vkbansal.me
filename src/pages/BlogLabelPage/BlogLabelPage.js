import React from 'react';
import { Link } from 'react-router-dom';

import Page from 'src/components/Page';
import ArticlePreview from 'src/Components/ArticlePreview';
import Pagination from 'src/Components/Pagination';
import settings from 'settings.yml';
import { getBlogUrls } from 'utils';

import styles from './BlogLabelPage.scss';

const { blog } = settings;
const urls = getBlogUrls(blog);

export default function BlogLabelPage(props) {
    let { label, num: pageNum = 1 } = props.match.params;
    const posts = props.tags[label].map((tag) => props.posts[tag])
    const pages = posts.length;
    const numPages = Math.ceil(pages / blog.postsLimit);

    pageNum = parseInt(pageNum, 10);

    const skip = (pageNum - 1) * blog.postsLimit;
    const url = (page) => page === 1
                            ? urls.labelUrl.replace(':label', label)
                            : urls.labelPaginationUrl.replace(':label', label).replace(':num', page);

    return (
        <Page {...props} className={styles['blogs-list']}>
           <section className='container'>
               <p>Showing posts with label <strong>{label}</strong>. <Link to={urls.index}>Show all posts</Link></p>
               <div className={styles['articles']}>
                    {posts.slice(skip, skip + blog.postsLimit).map((post, i) => (
                        <ArticlePreview key={i} post={post} className={styles['blog-page-article']} showTags />
                    ))}
               </div>
                <Pagination pages={numPages} currentPage={pageNum} url={url} />
            </section>
        </Page>
    );
}
