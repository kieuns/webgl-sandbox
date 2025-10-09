import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    files: ['**/*.ts'],
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
);
