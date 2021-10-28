'use strict';

const Joi = require('joi');
const { registerUser } = require('../../utils/userUtil');

exports.configureUserRoutes = (server) => {

    return server.route([
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
