'use strict';

module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es2021': true,
        'jest': true
    },
    'extends': 'plugin:@hapi/recommended',
    'parserOptions': {
        'ecmaVersion': 12
    },
    'plugins': ['jest'],
    'rules': {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error'
    }
};
