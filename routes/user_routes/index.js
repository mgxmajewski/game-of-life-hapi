'use strict';

const Joi = require('joi');
const {
    fetchUsers,
    findUsers,
    registerUser
} = require('../../utils/userUtil');

exports.configureUserRoutes = (server) => {

    return server.route([
        {
            method: 'GET',
            path: '/user/get',
            config: {
                description: 'Get users',
                tags: ['api', 'users'] },
            handler: async function (request, h) {

                try {
                    const allUsers = await fetchUsers();
                    console.log('success');
                    return allUsers;
                }
                catch (err) {
                    console.error('Ouch in getUsers', err);
                }
            } },
        {
            method: 'GET',
            path: '/user/find/{userName}/{emailAddress?}',
            config: {
                description: 'Find User By Name And/Or Email',
                tags: ['api', 'users'],
                validate: {
                    params: Joi.object({
                        userName: Joi.string().required(),
                        emailAddress: Joi.string().email()
                    })
                }
            },


            handler: async function (request, h) {

                let user = {};
                try {
                    console.log(request.params);
                    const { userName, emailAddress } = request.params;
                    const checkedForNullEmail = emailAddress ? emailAddress : '';
                    user = await findUsers(userName, checkedForNullEmail).then(

                        (userFound) => {

                            return userFound;
                        }).catch((err) => {

                        console.log('Throw Err From Handler'); throw err;
                    });

                }
                catch (err) {
                    console.error('Ouch in Handler', err);
                    return { response: err.errors };
                }

                return user;
            } },
        {
            method: 'POST',
            path: '/user/create',
            config: {
                description: 'Register users',
                tags: ['api', 'users'],
                validate: {
                    payload: Joi.object({
                        userName: Joi.string().required(),
                        emailAddress: Joi.string().email({ multiple: true }).required(),
                        password: Joi.string().required()
                    })
                }
            },
            handler: async function (request, h) {

                let newUser = {};
                try {
                    newUser  = await registerUser(request.payload.userName,
                        request.payload.password,request.payload.emailAddress ).then(
                        (registeredNewUser) => {

                            return registeredNewUser;
                        }).catch((err) => {

                        console.log('Throw Err From Handler'); throw err;
                    });

                }
                catch (err) {
                    console.error('Ouch in Handler', err);
                    return { response: err.errors };
                }

                return newUser;
            } }
    ]);
};
