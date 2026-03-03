// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const globals = require("globals");

module.exports = defineConfig([
    expoConfig,
    {
        ignores: ['dist/*'],
    },
    {
        files: ['scripts/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ['jest.config.js', 'jest.setup.js'],
        languageOptions: {
            globals: {
                ...globals.jest,
            }
        }
    },
    {
        files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
    {
        rules: {
            curly: 'error',
            'brace-style': ['error', '1tbs', { allowSingleLine: false }],
            indent: ['error', 4],
        },
    },
]);
