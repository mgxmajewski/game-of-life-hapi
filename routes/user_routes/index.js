'use strict';

const Joi = require('joi');
const Jwt = require('jsonwebtoken');
const Bcrypt = require('bcryptjs');
const {
    fetchUsers,
    findUsers,
    registerUser,
    findUserToAuth
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
        ,
        {
            method: 'POST',
            path: '/user/login',
            config: {
                description: 'AuthUser',
                tags: ['api', 'users'],
                validate: {
                    payload: Joi.object({
                        emailAddress: Joi.string().required(),
                        password: Joi.string().required()
                    })
                }
            },


            handler: async function (request, h) {

                const { emailAddress, password } = request.payload;

                let AuthUser = {};
                try {
                    AuthUser = await findUserToAuth(emailAddress).then(

                        (userFound) => {

                            console.log(`1: ${userFound.password}, 2: ${password}`);
                            const isAuth = Bcrypt.compare( password,userFound.password);
                            if (isAuth) {

                                const tokenAuth = Jwt.sign({ 'id': userFound.id }, 'NeverShareYourSecret');
                                return h.response(tokenAuth);
                            }

                            return h.response('401');


                        }).catch((err) => {

                        console.log('Throw Err From Handler'); throw err;
                    });

                }
                catch (err) {
                    console.error('Ouch in Handler', err);
                    return { response: err.errors };
                }

                return AuthUser;
            } }
    ]);
};
