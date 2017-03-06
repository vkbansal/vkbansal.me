import React from 'react';

import Page from 'src/components/Page';
import ArticlePreview from 'src/Components/ArticlePreview';

import banner from './web-design-banner.svg';
import styles from './Home.scss';

import settings from 'settings.yml';

export default function Home(props) {
    return (
        <Page {...props} className={styles['home-page']}>
            <section className={styles['intro']}>
                <div className='container'>
                    <div className={styles['text']}>
                        <h1>Hello, I'm Vivek.</h1>
                        <h2>A frontend web <span id="intro-type">developer</span></h2>
                    </div>
                    <object className={styles['banner']} type='image/svg+xml' data={banner}/>
                </div>
            </section>
            <section className='container'>
                {props.posts.slice(0, settings.homepage.postsLimit).map((post, i) => (
                    <ArticlePreview key={i} post={post} />
                ))}
            </section>
        </Page>
    );
}
