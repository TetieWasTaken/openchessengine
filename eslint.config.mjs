/** @format */

// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as importPlugin from 'eslint-plugin-import';
import { common, typescript, prettier } from 'eslint-config-neon';

export default [
	{
		ignores: ['node_modules/', 'dist/', 'babel.config.js', 'eslint.config.mjs', 'docs/'],
	},
	{
		plugins: {
			import: importPlugin,
		},
		rules: {
			'import/no-default-export': 'error',
		},
	},
	...tseslint.config(
		eslint.configs.recommended,
		tseslint.configs.strictTypeChecked,
		tseslint.configs.stylisticTypeChecked,
		{
			plugins: {
				import: importPlugin,
			},
			settings: {
				'import/resolver': {
					typescript: true,
					node: true,
				},
			},
			rules: {
				...(importPlugin.configs?.recommended?.rules ?? {}),
				...(importPlugin.configs?.typescript?.rules ?? {}),
			},
		},
		{
			languageOptions: {
				parserOptions: {
					projectService: true,
					tsconfigRootDir: import.meta.dirname,
				},
			},
		},
	),
	{
		rules: {
			'@typescript-eslint/no-unnecessary-condition': [
				'error',
				{
					allowConstantLoopConditions: true,
				},
			],
			eqeqeq: 'error',
			'no-console': 'error',
			'no-debugger': 'error',
			'prefer-arrow-callback': 'error',
			'prefer-template': 'error',
			'@typescript-eslint/explicit-function-return-type': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-non-null-assertion': 'error',
			'@typescript-eslint/no-unsafe-argument': 'error',
			'@typescript-eslint/no-unsafe-assignment': 'error',
			'@typescript-eslint/no-unsafe-call': 'error',
			'@typescript-eslint/no-unsafe-member-access': 'error',
			'@typescript-eslint/no-unsafe-return': 'error',
			'@typescript-eslint/no-unsafe-type-assertion': 'error',
			'@typescript-eslint/prefer-for-of': 'error',
			'@typescript-eslint/prefer-nullish-coalescing': 'error',
			'@typescript-eslint/prefer-optional-chain': 'error',
			'@typescript-eslint/restrict-plus-operands': [
				'error',
				{
					allowAny: false,
					allowBoolean: false,
					allowNullish: false,
					allowNumberAndString: false,
					allowRegExp: false,
				},
			],
			'@typescript-eslint/restrict-template-expressions': 'error',
			'@typescript-eslint/strict-boolean-expressions': [
				'error',
				{
					allowNumber: false,
					allowString: false,
				},
			],
			'@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',
		},
	},
	...common,
	...typescript,
	{
		rules: {
			'id-length': [
				'error',
				{
					exceptions: ['_', 'i', 'j', 'k', 'x', 'y', 'z'],
				},
			],
			'jsdoc/multiline-blocks': 'off',
		},
	},
	...prettier,
];
