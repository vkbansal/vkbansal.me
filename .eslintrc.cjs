module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
			impliedStrict: true,
		},
		project: 'tsconfig.json',
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	env: {
		node: true,
		es6: true,
		browser: true,
	},
	extends: [
		'eslint:recommended',
		'prettier',
		'plugin:@typescript-eslint/recommended',
		'plugin:astro/recommended',
	],
	rules: {
		'no-new-object': 2,
		'no-lonely-if': 2,
		camelcase: 2,
		'no-console': 2,
		'no-restricted-imports': 0,
		'no-unused-vars': 0,
		'@typescript-eslint/no-restricted-imports': [
			2,
			{
				paths: [
					{
						name: 'preact/debug',
					},
				],
			},
		],
		'@typescript-eslint/no-unused-vars': [
			2,
			{
				vars: 'all',
				args: 'after-used',
				ignoreRestSiblings: true,
				argsIgnorePattern: '^_',
			},
		],
		'@typescript-eslint/explicit-function-return-type': [
			2,
			{
				allowHigherOrderFunctions: true,
			},
		],
		'@typescript-eslint/consistent-type-imports': [
			2,
			{
				prefer: 'type-imports',
			},
		],
		'@typescript-eslint/prefer-nullish-coalescing': 0,
	},
	overrides: [
		{
			files: ['*.astro'],
			parser: 'astro-eslint-parser',
			globals: {
				Astro: true,
				Fragment: true,
			},
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro'],
				project: null,
			},
			rules: {
				'prettier/prettier': 0,
				'@typescript-eslint/no-non-null-assertion': 0,
			},
		},
		{
			files: ['*.d.ts'],
			rules: {
				'@typescript-eslint/triple-slash-reference': 0,
			},
		},
	],
};
