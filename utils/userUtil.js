'use strict';

const models = require('../model');
const { Op } = require('sequelize');

const User = models.usersModel;

const fetchUsers = async () => {

    console.log('Inside utils::userUtil.js::fetchUsers');
    let listUsers = {};
    try {
        listUsers = await User.findAll({
            attributes: ['id']
        });

    }
    catch (err) {
        console.error(err);
        throw (err);
    }

    return { listUsers };
};


module.exports = {
    fetchUsers
};
