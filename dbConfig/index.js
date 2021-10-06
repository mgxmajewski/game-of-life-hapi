const {Sequelize} = require('sequelize');

const seq = new Sequelize('postgres', 'postgres', 'password', {
    host: 'ubuntu2004.wsl',
    port: '5432',
    dialect: 'postgres'
});

seq.authenticate()
    .then(() => {console.log('Database connection established');})
    .catch(err => {console.error('Connection Disrupted.', err)})

seq.sync()
    .then(() => console.log('synced successfully'))


module.exports = {
    useModel:require('../models/User')(seq)
}

