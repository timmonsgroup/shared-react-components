module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
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
    'jsx-quotes': ['warn', 'prefer-double'],
    'react/prop-types': 'warn',
    'no-unused-vars': 'warn',
    'no-debugger': 'warn',
    'react/no-unescaped-entities': 'off',
    'no-empty': 'off',
    'no-extra-semi': 'warn',
    'semi': ["warn", "warn", { "beforeStatementContinuationChars": true }]
  },
};
