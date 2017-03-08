import React from 'react';

import Page from 'src/components/Page';
import Markdown from 'src/components/Markdown';

import settings from 'settings.yml';

const social = new Map(settings.social);

export default function About(props) {
    return (
        <Page {...props}>
            <div className='container'>
                <Markdown>
                    {`I am Vivek Kumar Bansal, a frontend developer and designer. My hometown is *Hyderabad, India*,
                    but I currently stay in *Bengaluru, India*. I enjoy exploring and learning new technologies.
                    I’m an active proponent of Modern JavaScript, CSS3 and HTML5. **I ❤ Open Source** and actively
                    contribute on [GitHub](${social.get('github').link}). Currently, I serve full-time as
                    an UI Engineer at [Flipkart, Bengaluru](https://flipkart.com). I also work on freelance projects
                    from time to time. I began freelancing in August 2013 and have been since working closely with
                    companies and individuals on variety of projects. And when I'm not developing or learning, I like to
                    unwind by listening music and playing PC games.`}
                </Markdown>
            </div>
        </Page>
    );
}
