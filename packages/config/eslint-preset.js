module.exports = {
  extends: ['next', 'turbo', 'prettier'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react-hooks/exhaustive-deps': 'warn',
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
}
