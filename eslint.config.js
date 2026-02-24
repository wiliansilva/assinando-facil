import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import prettier from 'eslint-plugin-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default tseslint.config(
	{ ignores: ['dist'] },
	{
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
			eslintConfigPrettier,
		],
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			'@stylistic': stylistic,
			prettier,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'@stylistic/comma-dangle': [2, 'always-multiline'],
			'@stylistic/semi': ['error', 'never'],
			'@stylistic/quotes': ['error', 'single'],
			'@stylistic/eol-last': ['error', 'always'],
			'@stylistic/object-curly-spacing': ['error', 'always'],
			'@stylistic/indent': 'off',
			'@stylistic/jsx-closing-bracket-location': [1, 'tag-aligned'],
			'@stylistic/jsx-closing-tag-location': [1, 'tag-aligned'],
			'@stylistic/jsx-max-props-per-line': [
				1,
				{ maximum: 1, when: 'multiline' },
			],
			'@stylistic/jsx-first-prop-new-line': [1, 'multiline-multiprop'],
			'@stylistic/jsx-equals-spacing': [1, 'never'],
			'@stylistic/jsx-curly-newline': [
				1,
				{ singleline: 'consistent', multiline: 'consistent' },
			],
			'@stylistic/jsx-self-closing-comp': [1, { component: true, html: true }],
			'@stylistic/jsx-props-no-multi-spaces': [1],
			'@stylistic/jsx-pascal-case': [1, { allowNamespace: true }],
			'@stylistic/object-curly-newline': 'off',
			'@stylistic/function-paren-newline': ['off'],
			'prettier/prettier': [
				'error',
				{
					printWidth: 80,
					bracketSameLine: false,
					singleAttributePerLine: true,
					semi: false,
					singleQuote: true,
					jsxSingleQuote: true,
					quoteProps: 'as-needed',
					tabWidth: 2,
					useTabs: true,
					endOfLine: 'auto',
				},
			],
		},
	},
)
