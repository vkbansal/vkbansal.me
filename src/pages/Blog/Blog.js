import React from 'react';

import Page from 'src/components/Page';
import ArticlePreview from 'src/Components/ArticlePreview';
import Pagination from 'src/Components/Pagination';
import { getBlogUrls } from 'utils';
import settings from 'settings.yml';

import styles from './Blog.scss';

const { blog } = settings;
const urls = getBlogUrls(blog);

export default function Blog(props) {
    const pages = props.posts.length;
    const numPages = Math.ceil(pages / blog.postsLimit);
    let page = props.match.params.num || 1;

    page = parseInt(page, 10);
    const skip = (page - 1) * blog.postsLimit;

    const url = (page) => page === 1 ? urls.index : urls.paginationUrl.replace(':num', page);

    return (
        <Page {...props} className={styles['blogs-list']}>
           <section className='container'>
               <div className={styles['articles']}>
                    {props.posts.slice(skip, skip + blog.postsLimit).map((post, i) => (
                        <ArticlePreview key={i} post={post} className={styles['blog-page-article']}
                            showTags />
                    ))}
               </div>
                <Pagination pages={numPages} currentPage={page} url={url} />
            </section>
        </Page>
    );
}
