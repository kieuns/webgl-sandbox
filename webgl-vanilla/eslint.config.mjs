import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      ecmaVersion: 2022,
    },
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
      'indent': ['error', 2, { 'SwitchCase': 1 }],
      'no-undef': 'error',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxBOF': 0, 'maxEOF': 0 }],
      'space-before-function-paren': ['error', {
        'anonymous': 'always',
        'named': 'never',
        'asyncArrow': 'always'
      }],
      'array-element-newline': ['error', 'consistent']
    }
  },
  // .js 파일에는 CommonJS 설정 적용
  {

    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs'
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    }
  },
  // .mjs 파일에는 ES Modules 설정 적용
  {
    files: ['**/*.mjs'],
    languageOptions: {
      sourceType: 'module'
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    }
  },
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    rules: {
      'no-unused-vars': 'off', // JavaScript 규칙 비활성화
      '@typescript-eslint/no-unused-vars': 'warn' // TypeScript 규칙 활성화
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } }
  },
];
