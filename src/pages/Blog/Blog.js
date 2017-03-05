import React from 'react';

import Page from 'src/components/Page';
import ArticlePreview from 'src/Components/ArticlePreview';
import Pagination from 'src/Components/Pagination';
import settings from 'settings.yml';

import styles from './Blog.scss';

export default function Blog(props) {
    const limit = settings.blog.postsLimit;
    const pages = props.posts.length;
    const numPages = Math.ceil(pages / limit);
    let page = props.match.params.num || 1;

    page = parseInt(page, 10);
    const skip = (page - 1) * limit;

    const url = (page) => page === 1 ? '/blog/' : settings.blog.paginationUrl.replace(':num', page);

    return (
        <Page {...props} className={styles['blogs-list']}>
           <section className='container'>
               <div className={styles['articles']}>
                    {props.posts.slice(skip, skip + limit).map((post, i) => (
                        <ArticlePreview key={i} post={post} className={styles['blog-page-article']}
                            showTags />
                    ))}
               </div>
                <Pagination pages={numPages} currentPage={page} url={url} />
            </section>
        </Page>
    );
}
