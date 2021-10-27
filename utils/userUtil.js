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

module.exports = {
    fetchUsers,
    findUsers
};
