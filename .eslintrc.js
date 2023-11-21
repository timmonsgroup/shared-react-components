module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    quotes: [
      'warn',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    'indent': ['warn', 2, { 'SwitchCase': 1 }],
    'no-unused-vars': 'warn',
    'no-debugger': 'warn',
    'no-empty': 'off',
    'no-extra-semi': 'warn',
    'curly': 'warn'
  },
};
