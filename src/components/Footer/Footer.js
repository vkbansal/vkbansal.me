import React from 'react';
import cx from 'classnames';

import * as Icons from 'src/components/Icons';
import settings from 'settings.yml';

import $ from './Footer.scss';

const { author, social } = settings;
const footerLinks = social.filter((link) => link[1].footer);
const footerBreak = Math.ceil(footerLinks.length / 2);

export default function Footer() {
    const renderFooterLinks = ([name, media], i) => (
        <a key={name} href={media.link} title={media.name}
            className={cx($['link'], $[name])}>
            {media.name}
        </a>
    );

    return (
        <footer className={$['footer']}>
            <div className={cx('container', $['container'])}>
                <div className='col-8-12'>
                    <h4>Find me on internet</h4>
                    <div className={$['social']}>
                        <div className='col-6-12'>
                            {footerLinks.slice(0, footerBreak).map(renderFooterLinks)}
                        </div>
                        <div className='col-6-12'>
                            {footerLinks.slice(footerBreak).map(renderFooterLinks)}
                        </div>
                    </div>
                </div>
                <div className='col-4-12'>
                    <p className={$['copyright']}>
                        &copy; {(new Date()).getUTCFullYear()} <a href={'/'}>{author.name}</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
