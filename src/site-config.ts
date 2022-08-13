import codepen from './images/codepen.svg';
import github from './images/github.svg';
import linkedin from './images/linkedin.svg';
import npm from './images/npm.svg';
import twitter from './images/twitter.svg';

export const SITE_TITLE = 'Vivek Kumar Bansal, Web Dev.';
export const SITE_URL = 'https://vkbansal.me';
export const CODE_REPOSITORY = 'https://github.com/vkbansal/vkbansal.me/';

export const AUTHOR = {
	name: 'Vivek Kumar Bansal',
	email: 'contact@vkbansal.me',
	website: 'https://vkbansal.me',
};

export const PAGE_SIZE = 5;

export const NAV_LINKS = [
	{
		title: 'Blog',
		to: '/blog/',
		external: false,
	},
	{
		title: 'F1 Stats',
		to: 'https://f1.vkbansal.me',
		external: true,
	},
];

export interface SocialLink {
	name: string;
	link: string;
	username?: string;
	img?: string;
	follow: boolean;
	footer: boolean;
	share: boolean;
}

export const SOCIAL_LINKS: SocialLink[] = [
	{
		name: 'RSS',
		link: 'http://feeds.feedburner.com/vkbansal',
		follow: false,
		footer: false,
		share: false,
	},
	{
		name: 'Twitter',
		link: 'http://twitter.com/_vkbansal',
		username: '_vkbansal',
		img: twitter,
		follow: true,
		footer: true,
		share: true,
	},
	{
		name: 'GitHub',
		link: 'https://github.com/vkbansal',
		username: 'vkbansal',
		img: github,
		follow: true,
		footer: true,
		share: false,
	},
	{
		name: 'CodePen',
		link: 'http://codepen.io/vkbansal/',
		img: codepen,
		follow: false,
		footer: false,
		share: false,
	},
	{
		name: 'LinkedIn',
		link: 'https://in.linkedin.com/in/vkbansal03',
		img: linkedin,
		follow: true,
		share: true,
		footer: true,
	},
	{
		name: 'npm',
		link: 'https://www.npmjs.com/~vkbansal',
		img: npm,
		follow: false,
		share: false,
		footer: true,
	},
];
