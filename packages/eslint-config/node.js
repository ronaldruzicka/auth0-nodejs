import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import pluginN from 'eslint-plugin-n';
import pluginPromise from 'eslint-plugin-promise';
import pluginSecurity from 'eslint-plugin-security';
import pluginRegexp from 'eslint-plugin-regexp';
import unusedImports from 'eslint-plugin-unused-imports';
import { config as baseConfig } from './base.js';

/**
 * A custom ESLint configuration for Node.js (server-side) packages / apps.
 * Focuses on: Node API safety, import hygiene, promises, security lint, unused imports.
 *
 * @type {import("eslint").Linter.Config[]} */
export const nodeConfig = [
	...baseConfig,
	js.configs.recommended,
	eslintConfigPrettier,
	// Spread type-aware configs; in typescript-eslint v8 these are arrays of config objects
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	// Enable project service so type-aware rules have type info without enumerating every tsconfig.
	{
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		plugins: {
			n: pluginN,
			promise: pluginPromise,
			security: pluginSecurity,
			regexp: pluginRegexp,
			'unused-imports': unusedImports,
		},
		rules: {
			'n/no-deprecated-api': 'warn',
			// Enable if unresolved import issues arise; TS + bundlers usually handle.
			'n/no-missing-import': 'off',

			// Promises
			'promise/no-multiple-resolved': 'error',

			// Security (tuned to reduce false positives)
			'security/detect-object-injection': 'off',

			// Regex safety
			'regexp/no-dupe-disjunctions': 'error',
			'regexp/no-empty-alternative': 'error',

			// Unused imports / vars (prefer plugin for better DX)
			'no-unused-vars': 'off',
			'unused-imports/no-unused-imports': 'warn',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],
		},
	},
	{
		// Ignore build outputs for Node libs
		ignores: ['dist/**', 'coverage/**', '**/eslint.config.js'],
	},
];
