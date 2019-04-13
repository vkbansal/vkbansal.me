import cx from 'classnames';

import { html } from '../../scripts/html';
import { RenderArgs } from '../../typings/common';
import { useStyles } from '../../scripts/useStyles';
import data from '../data.json';

export async function Header(props: RenderArgs) {
    const styles = await useStyles(headerStyles);

    return (
        <header class={styles['header']}>
            <div class={cx('container', styles['container'])}>
                <a href="/" class={styles['logo']} title="Home Page" />
                <div />
                <ul class={styles['nav-menu']}>
                    {data.nav.map(n => {
                        const cl = cx(styles['link'], {
                            [styles['active']]: props.url.startsWith(n.link)
                        });

                        return (
                            <li class={styles['link-container']}>
                                <a
                                    href={n.link}
                                    class={cl}
                                    title={n.link}
                                    target={n.external ? '_blank' : '_self'}>
                                    {n.title}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </header>
    );
}

const headerStyles = /* css */ `
@import 'variables.scss';

.header {
    margin: 8px 0 24px 0;
    box-shadow: 0 -4px $color-dark, 0 -8px $color-primary;

    & .container {
        display: grid;
        grid-template-columns: [logo] 100px [dummy] 1fr [navlinks] 240px;
        grid-template-rows: 30px;
        padding: 24px 0;
        border-bottom: 1px solid $color-divider;
    }

    & .logo {
        grid-column: logo;
        display: block;
        margin: 0 15px;
        cursor: pointer;
        background-image: url(images/logo.svg);
        background-size: contain;
        background-repeat: no-repeat;
    }

    & .nav-menu {
        list-style-type: none;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        padding: 0;
        margin: 0;

        & .link-container {
            display: block;
            margin: 0;
        }

        & .link {
            display: flex;
            justify-content: center;
            align-items: center;
            text-decoration: none;
            color: $color-dark;
            cursor: pointer;
            padding: 0 15px;

            &:hover {
                color: $color-primary;
            }

            &.active {
                color: $color-primary;
                font-weight: bold;
            }
        }
    }

    @media print {
        display: none;
    }
}
`;
