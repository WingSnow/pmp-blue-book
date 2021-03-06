module.exports = {
  env: {
    browser: true,
    es2021: true,
    'vue/setup-compiler-macros': true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.d.ts', 'src/**/*.tsx', 'src/**/*.vue'],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
      plugins: ['vue', '@typescript-eslint'],
      extends: [
        'plugin:vue/vue3-essential',
        'airbnb-base',
        'airbnb-typescript/base',
        '@vue/typescript/recommended',
        'plugin:prettier/recommended',
      ],
    },
    {
      files: ['server/src/**/*.ts'],
      parserOptions: {
        project: ['./server/tsconfig.json'],
      },
      plugins: ['vue', '@typescript-eslint'],
      extends: [
        'plugin:vue/vue3-essential',
        'airbnb-base',
        'airbnb-typescript/base',
        '@vue/typescript/recommended',
        'plugin:prettier/recommended',
      ],
    },
  ],
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
}
