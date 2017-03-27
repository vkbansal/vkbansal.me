import React from 'react';

import Page from 'src/components/Page';
import ArticlePreview from 'src/components/ArticlePreview';
import Markdown from 'src/components/Markdown';

import profile from './mypic.png';
import $ from './Home.scss';

import settings from 'settings.yml';

const social = new Map(settings.social);

const ABOUT = `
## About

I'm an UI Engineer at [Flipkart, Bengaluru](https://flipkart.com). I enjoy exploring and learning new technologies.
I’m an active proponent of Modern JavaScript, CSS3 and HTML5. **I ❤ Open Source** and actively
contribute on [GitHub](${social.get('github').link}).`;

export default function Home(props) {
    return (
        <Page {...props} className={$['home-page']}>
            <section className={$['intro']}>
                <div className='container'>
                    <div className={$['profile-pic']}>
                        <img className={$['profile-img']}  src={profile} alt={settings.author.name} />
                    </div>
                    <div className={$['text']}>
                        <h1>Vivek Kumar Bansal</h1>
                        <h2>Full-stack JavaScript developer</h2>
                    </div>
                    <Markdown className={$['about']}>
                    {ABOUT}
                    </Markdown>
                </div>
            </section>
            <section className='container'>
                <h2>Latest from Blog</h2>
                {props.posts.slice(0, settings.homepage.postsLimit).map((post, i) => (
                    <ArticlePreview key={i} post={post} />
                ))}
            </section>
        </Page>
    );
}
