const jsdoc = require('eslint-plugin-jsdoc');
const prettier = require('eslint-plugin-prettier');

module.exports = [
  /* {
    plugins: {
      jsdoc,
    },
    rules: {
      ...Object.fromEntries(
        Object.entries(jsdoc.configs.recommended.rules).map(([key]) => [
          key,
          'warn',
        ]),
      ),
    },
  }, */
  {
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      jsdoc,
      prettier,
    },
    rules: {
      'accessor-pairs': 'warn',
    },
  },
];
