'use strict';

const { Sequelize } = require('sequelize');

const Config = require('../config');

const seq = new Sequelize(Config.DbConfig.DEVELOPMENT.DB_NAME,
    Config.DbConfig.DEVELOPMENT.DB_USER,
    Config.DbConfig.DEVELOPMENT.DB_PASS,
    {
        host: Config.DbConfig.DEVELOPMENT.DB_HOST,
        port: Config.DbConfig.DEVELOPMENT.DB_PORT,
        dialect: Config.DbConfig.DEVELOPMENT.DIALECT,
        pool: {
            max: 50,
            min: 0,
            idle: 10000
        }
    }
);

seq.authenticate()
    .then( () => {

        console.log('Database connection established');
    })
    .catch( (err) => {

        console.error('Connection Disrupted.', err);
    });

seq.sync()
    .then(() => console.log('synced successfully'));

module.exports = {
    usersModel: require('./User')(seq)
};

