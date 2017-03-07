import React from 'react';
import cx from 'classnames';

import * as Icons from 'src/components/Icons';
import settings from 'settings.yml';

import styles from './Footer.scss';

const { site, social } = settings;
const footerLinks = social.filter((link) => link[1].footer);

const captalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

export default function Footer() {
    return (
        <footer className={styles['footer']}>
            <div className={cx('container', styles['container'])}>
                <p className={styles['copyright']}>
                    Copyright &copy; {(new Date()).getUTCFullYear()} {site.author.name}. All rights reserved.
                </p>
                <div className={styles['social']}>
                    {footerLinks.map(([name, media], i) => {
                        const Icon = Icons[captalize(name)];

                        return (
                            <a key={name} href={media.link} title={media.name}
                                className={cx(styles['link'], styles[name])}>
                                <Icon />
                            </a>
                        )
                    })}
                </div>
            </div>
        </footer>
    )
}
