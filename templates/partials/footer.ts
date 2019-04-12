import cx from 'classnames';

import { useStyles } from '../../scripts/useStyles';
import data from '../data.json';

const footerLinks = Object.values(data.social).filter(link => link.footer);

export async function render() {
    const styles = await useStyles(footerStyles);

    return /* html */ `
    <footer class="${styles['footer']}">
        <div class="${cx('container', styles['container'])}">
            <div class="${styles['social']}">
                <h4 class="${styles['heading']}">Find me on internet:</h4>
                    ${footerLinks
                        .map(s => {
                            const cl = cx(styles['social-link'], styles[s.name.toLowerCase()]);

                            return /*html*/ `
                            <a class="${cl}" href="${s.link}" target="_blank">
                                ${s.name}
                            </a>
                            `;
                        })
                        .join('\n')}
            </div>
            <p class="${styles['copyright']}">
                &copy; ${new Date().getUTCFullYear()} <a href="/">Vivek Kumar Bansal</a>
            </p>
        </div>
    </footer>`;
}

const footerStyles = /* css */ `
@import 'variables.scss';
@import 'social.scss';

.footer {
    margin: 8px 0;
    box-shadow: 0 4px $color-dark, 0 8px $color-primary;

    & .container {
        padding: 48px 0;
        border-top: 1px solid $color-divider;
    }

    & .heading {
        margin: 0;
    }

    & .copyright {
        margin: 0;
        font-size: 0.8rem;
    }

    & .social {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: 40px;
        flex-grow: 1;
    }

    & .social-link {
        display: block;
        justify-self: center;

        &:before {
            content: '';
            width: 18px;
            height: 24px;
            margin-right: 6px;
            display: inline-block;
            background-size: 100%;
            vertical-align: bottom;
            background-repeat: no-repeat;
            background-position: 50% 50%;
        }

        &.twitter {
            color: $brand-twitter-blue;

            &:before {
                background-image: url(images/twitter.svg);
            }
        }

        &.github {
            color: $brand-github-dark-grey;

            &:before {
                background-image: url(images/github.svg);
            }
        }

        &.codepen {
            color: #222;

            &:before {
                background-image: url(images/codepen.svg);
            }
        }

        &.linkedin {
            color: $brand-linkedin-blue;

            &:before {
                background-image: url(images/linkedin.svg);
                height: 26px;
            }
        }

        &.npm {
            color: $brand-npm-red;

            &:before {
                background-image: url(images/npm.svg);
                width: 32px;
                margin-right: 2px;
                height: 20px;
            }
        }
    }

    @media print {
        display: none;
    }
}
`;
