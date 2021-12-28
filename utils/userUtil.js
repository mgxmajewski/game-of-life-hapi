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

const findUsers = async (firstNameP, emailP) => {

    console.log('Inside utils::userUtil.js::fetchUsers');

    let listUsers;
    try {
        if (emailP === '') {
            listUsers = await User.findAll({
                attributes: ['userName', 'emailAddress'],
                where: {
                    userName:
                        {
                            [Op.like]: firstNameP
                        }
                }
            });
        }
        else if (emailP !== '') {
            listUsers = await User.findAll({
                attributes: ['userName', 'emailAddress'],
                where: {
                    [Op.and]: [
                        {
                            userName:
                                {
                                    [Op.like]: firstNameP
                                }
                        },
                        {
                            emailAddress: emailP
                        }
                    ]
                }
            });
        }
    }
    catch (err) {
        console.error(err);
        throw err;
    }

    return { listUsers };
};

const fetchUserByPk = async (pk) => {

    const userById = await User.findByPk(pk);
    if (userById === null) {
        return null;
    }

    return userById;
};

const registerUser = async (firstNameP, passwordP, emailP) => {

    console.log('Inside utils::userUtil.js::registerUser');
    let result = {};
    try {
        const regUser = await User.build({
            userName: firstNameP,
            emailAddress: emailP,
            password: passwordP
        }).save();
        await User.sync();
        result = regUser.toJSON();
    }
    catch (err) {
        console.error(err + 'Inside utils::userUtil.js');
        throw (err);
    }

    return { result };
};

const findUserToAuth = async (emailAddress) => {

    console.log('Inside utils::userUtil.js::findUserToAuth ');

    let listUsers;
    try {
        listUsers = await User.findOne({
            attributes: ['id', 'emailAddress', 'password'],
            where: {
                emailAddress
            }
        });
    }
    catch (err) {
        console.error(err);
        throw (err);
    }

    return listUsers;
};

module.exports = {
    fetchUsers,
    findUsers,
    fetchUserByPk,
    registerUser,
    findUserToAuth
};
