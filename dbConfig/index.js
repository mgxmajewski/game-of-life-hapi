const {Sequelize} = require('sequelize');

const seq = new Sequelize('game-db', 'postgres', 'password', {
    host: 'localhost',
    port: '5432',
    dialect: 'postgres'
});

seq.authenticate()
    .then(
        () =>{console.log("Database connection established");})
    .catch(err=>
    {console.error('Connection Disrupted.', err)})

seq.sync()
    .then(() => console.log('synced successfully'))



module.exports = {
    useModel:require('../models/User')(seq)
}

