module.exports = {
  extends: ['airbnb-base'],
  parser: 'babel-eslint', // Use Babel-ESLint for parsing JavaScript
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'import/no-named-as-default': 'off',
    'no-underscore-dangle': 'off',
  },
};
