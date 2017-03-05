import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import Logo from './Logo';
import styles from './Header.scss';

const nav = [
    { title: 'About', link: '/about/'},
    { title: 'Blog', link: '/blog/'},
    { title: 'Contact', link: 'mailto:contact@vkbansal.me'},
    { title: 'RSS', link: '/feed.xml'}
];

function Header ({match}) {
    return (
        <header className={cx(styles['header'], {[styles['home-page']]: match.path === '/'})}>
            <div className={cx('container', styles['container'])}>
                <Link to='/' className={styles['logo']}>
                    <Logo fill={match.path === '/' ? '#ffffff' : '#f44336'}/>
                </Link>
                <ul className={styles['nav-menu']}>
                    {nav.map((n, i) => (
                        <li key={i} className={styles['link-container']}>
                            <Link to={n.link} className={cx(styles['link'], {[styles['active']]: match.url === n.link})}>
                                {n.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}

export default Header;
