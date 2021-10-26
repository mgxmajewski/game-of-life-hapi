'use strict';

const DB_CONSTANTS = {
    DEVELOPMENT:
    {
        DB_PORT: 5432,
        DIALECT: 'postgres',
        DB_NAME: 'postgres',
        DB_PASS: 'password',
        DB_USER: 'postgres',
        DB_HOST: 'ubuntu2004.wsl'
    },
    PRODUCTION:
    {
        DB_PORT: 5432,
        DIALECT: 'postgres'
    }
};

module.exports = DB_CONSTANTS;
