import React, { PropTypes } from 'react';
import { NavLink as Link } from 'react-router-dom';
import cx from 'classnames';

import logo from './logo.svg';
import $ from './Header.scss';

const nav = [
    { title: 'Blog', link: '/blog/' },
    { title: 'Contact', link: 'mailto:contact@vkbansal.me' },
    { title: 'RSS', link: '/feed.xml' }
];

function Header({ match }) {
    return (
        <header className={cx($['header'], { [$['home-page']]: match.path === '/' })}>
            <div className={cx('container', $['container'])}>
                <Link to='/' className={$['logo']}>
                    <img className={$['logo-img']} src={logo} />
                </Link>
                <ul className={$['nav-menu']}>
                    {nav.map(n => (
                        <li key={n.title} className={$['link-container']}>
                            <Link to={n.link} className={cx($['link'])} activeClassName={$['active']}>
                                {n.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}

Header.propTypes = {
    match: PropTypes.object.isRequired
};

export default Header;
