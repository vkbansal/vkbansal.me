import { RenderArgs } from '../typings/common';
import meta from './meta.json';

export async function render(props: RenderArgs) {
    const { styles } = props;
    // const postsToRender = props.posts.slice(0, meta.homepage.postsLimit);

    return Promise.resolve(`<div class="${styles['home-page']}">
<section class="container">
        <div class="${styles['profile-pic']}">
            <img class="profile-img" src="./images/mypic.png" alt="profile-pic" />
        </div>
        <div class="text">
            <h1>Vivek Kumar Bansal</h1>
            <h2>UI Engineer. I <span>❤</span> making stuff.</h2>
            <h3>About</h3>
            <p>
                Im an UI Engineer II at <a href="https://flipkart.com" target="_blank">Flipkart, Bengaluru</a>.
                I enjoy exploring and learning new technologies. I’m an active proponent of Modern JavaScript,
                CSS3 and HTML5. <strong>I ❤ Open Source</strong> and actively contribute on
                <a href="${meta.social.github.link}" target="_blank">GitHub</a>.
            </p>
        </div>
</section>
<section class="container">
    <h2>Latest from Blog</h2>

    ${props.posts
        .slice(0, meta.homepage.postsLimit)
        .map(post => {
            return `<div>${JSON.stringify(post)}<div/>`;
        })
        .join('\n')}
</section></div>`);
}

export function styles() {
    return /* css */ `
@import "variables.scss";

.home-page {
    .profile-pic {
        text-align: center;
        padding: 48px 0 16px 0;

        .profile-img {
            display: inline-block;
            width: 140px;
            height: 140px;
            margin: 0 auto;
            box-shadow: 0 0 0 6px $color-primary;
            border-radius: 50%;
        }
    }

    .text {
        text-align: center;
        position: relative;
        margin-bottom: 48px;
        text-transform: uppercase;

        h1 {
            font-size: 64px;
            line-height: 1.25;
            margin: 0;
        }

        h2 {
            font-size: 32px;
            line-height: 1.25;
            margin: 0;
        }
    }

    .about {
        padding: 48px 0;
    }
}
`;
}
