/*
const {Sequelize} = require('sequelize');

const seq = new Sequelize('postgres', 'postgres', 'password', {
    host: '172.27.120.155',
    port: '5432',
    dialect: 'postgres'
});

seq.authenticate()
    .then(
        () =>{console.log("Database connecdtion established");})
    .catch(err=>
    {console.error('Connection Disrupted.', err)})

seq.sync()
    .then(() => console.log('synced successfully'))



module.exports = {
    useModel:require('../models/User')(seq)
}
*/

