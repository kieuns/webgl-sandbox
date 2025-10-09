import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'indent': ['error', 2],
      'no-unused-vars': 'warn',
      'semi': ['error', 'always'],
      'brace-style': ['error', 'stroustrup', {
        'allowSingleLine': true
      }],
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxBOF': 0, 'maxEOF': 0 }],
    }
  }
];
