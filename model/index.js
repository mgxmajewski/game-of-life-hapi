'use strict';

const { Sequelize } = require('sequelize');

const seq = new Sequelize(process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DIALECT,
        pool: {
            max: 50,
            min: 0,
            idle: 10000
        }
    }
);

const modelDefiners = [
    require('./User'),
    require('./Pattern'),
    require('./PatternRecord')
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(seq);
}

const usersModel = seq.model('User');
const patternsModel = seq.model('Pattern');
const patternRecordsModel = seq.model('PatternRecord');

patternRecordsModel.belongsTo(usersModel, { foreignKey: 'creator' });

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
    usersModel,
    patternsModel,
    patternRecordsModel
};

