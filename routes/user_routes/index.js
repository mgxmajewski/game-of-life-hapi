'use strict';

const Joi = require('joi');
const Jwt = require('jsonwebtoken');
const Bcrypt = require('bcryptjs');
// const { v4: uuidv4 } = require('uuid');
const {
    fetchUsers,
    findUsers,
    registerUser,
    findUserToAuth
} = require('../../utils/userUtil');
const JwtDecode = require('jwt-decode');
const Redis = require('redis');
const { promisify } = require('util');

const redisClient = Redis.createClient();
const getRedisAsync = promisify(redisClient.get).bind(redisClient);
const delRedisAsync = promisify(redisClient.del).bind(redisClient);

const isSequelizeError = (err) => err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError';
const sequelizeErrorsResponse = (h, err) => {

    const errors = err.errors.map((err) => err.message);
    console.error('Ouch in Handler', errors);
    const data = {
        messages: errors
    };
    return h.response(data).code(419);
};

// const joiErrorHandler = (request, h, err) => {
//
//     console.log(`err: ` + JSON.stringify(err.details));
//     // return h.response(err.message);
//     // throw err.message;
//     // return err.message;
//     return h
//         .response(err.message)
//         .code(418)
//         .takeover();
// };

const cookieOptions = {
    // ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
    // encoding: 'none',    // we already used JWT to encode
    isSecure: false,      // warm & fuzzy feelings
    isHttpOnly: true,
    // isSameSite: false // prevent client alteration
    // clearInvalid: false, // remove invalid cookies
    // strictHeader: true,  // don't allow violations of RFC 6265
    path: '/'            // set the cookie for all routes
};

exports.configureUserRoutes = (server) => {

    return server.route([
        {
            method: 'GET',
            path: '/user/get',
            config: {
                description: 'Get users',
                tags: ['api', 'users']
            },
            handler: async function (request, h) {

                try {
                    const allUsers = await fetchUsers();
                    console.log('success');
                    return allUsers;
                }
                catch (err) {
                    console.error('Ouch in getUsers', err);
                }
            }
        },
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
                        (userFromDb) => {

                            return userFromDb;
                        }).catch((err) => {

                        console.log('Throw Err From Handler');
                        throw err;
                    });

                }
                catch (err) {
                    console.error('Ouch in Handler', err);
                    return { response: err.errors };
                }

                return user;
            }
        },
        {
            method: 'POST',
            path: '/user/create',
            config: {
                description: 'Register users',
                tags: ['api', 'users']
                // validate: {
                //     payload: Joi.object({
                //         userName: Joi.string().required(),
                //         emailAddress: Joi.string().email().required(),
                //         password: Joi.string()
                //             .required()
                //             .empty()
                //             .min(5)
                //             .max(20)
                //             .messages({
                //                 'string.base': `"password" should be a type of 'text'`,
                //                 'string.empty': `"password" cannot be an empty field`,
                //                 'string.min': `"password" should have a minimum length of {#limit}`,
                //                 'string.max': `"password" should have a maximum length of {#limit}`,
                //                 'any.required': `"password" is a required field`
                //             })
                //     }),
                //     failAction: joiErrorHandler
                // }
            },
            handler: async function (request, h) {

                let newUser = {};
                try {
                    newUser = await registerUser(
                        request.payload.userName,
                        request.payload.password,
                        request.payload.emailAddress)
                        .then((registeredNewUser) => {

                            return h.response({ messages: [`Account successfully created`] }).code(200);
                        })
                        .catch((err) => {

                            console.log('Throw Err From SequelizeValidationError Handler');
                            throw err;
                        });

                }
                catch (err) {

                    if (isSequelizeError(err)) {
                        return sequelizeErrorsResponse(h, err);
                    }

                    return h.response({ messages: err.errors }).code(418);
                }

                return newUser;
            }
        },
        {
            method: 'POST',
            path: '/user/login',
            config: {
                description: 'AuthUser',
                tags: ['api', 'users'],
                validate: {
                    headers: Joi.object().keys({
                        authorization: Joi.string().required()
                    }).options({ allowUnknown: true })
                }
            },


            handler: async function (request, h) {

                // parse login and password from headers
                const b64auth = (request.headers.authorization || '').split(' ')[1] || '';
                const [emailAddress, password] = Buffer.from(b64auth, 'base64').toString().split(':');


                const findUser = async () => {

                    return await findUserToAuth(emailAddress)
                        .then((isUserInDB) => {

                            if (isUserInDB === null) {
                                throw new Error('User not registered');
                            }
                            else {
                                return isUserInDB;
                            }
                        });
                };


                const isUserAuth = async (user) => {

                    return await Bcrypt.compare(password, user.password)
                        .then((passwordMatch) => {

                            if (passwordMatch === false) {
                                throw new Error('Wrong password');
                            }
                            else {
                                return true;
                            }
                        });
                };

                let AuthResponse = {};
                try {
                    const userFromDb = await findUser();
                    AuthResponse = await isUserAuth(userFromDb)
                        .then((authenticationResult) => {

                            if (authenticationResult === true) {
                                const session = {
                                    id: userFromDb.id
                                    // id: uuidv4() // a random session id
                                    // valid: true // this will be set to false when the person logs out
                                    // expiresIn: new Date().getTime() + 60 * 1000 // expires in 60 minutes time
                                };
                                // create the session in Redis
                                redisClient.set(userFromDb.id, JSON.stringify(session));
                                const accessToken = Jwt.sign(session, process.env.ACCESS_SECRET, { expiresIn: '10s' });
                                const refreshToken = Jwt.sign({ id: userFromDb.id }, process.env.REFRESH_SECRET);
                                return h.response({ accessToken }).state('refreshToken', refreshToken, cookieOptions);
                            }
                        })
                        .catch((err) => {

                            console.log('Throw Err From Handler');
                            throw err;
                        });
                }
                catch (err) {

                    if (isSequelizeError(err)) {
                        return sequelizeErrorsResponse(h, err);
                    }

                    return h.response({ messages: [err.message] }).code(418);
                }

                return AuthResponse;
            }
        },
        {
            method: 'POST',
            path: '/user/refresh-token',
            config: {
                description: 'RefreshToken',
                tags: ['api', 'users']
                // validate: {
                //     headers: Joi.object().keys({
                //         authorization: Joi.string().required()
                //     }).options({ allowUnknown: true })
                // }
            },

            handler: async function (request, h) {

                let newAccessToken;
                const { refreshToken } = request.state;

                if (refreshToken === undefined) {
                    return h.response('No Refresh Token').code(401);
                }

                const userId = JwtDecode(refreshToken).id;

                const session = {
                    id: userId
                    // id: uuidv4() // a random session id
                    // valid: true // this will be set to false when the person logs out
                    // exp: new Date().getTime() + 5 * 1000 // expires in 30 minutes time
                };

                const isInRedis = await getRedisAsync(userId)
                    .then((res) => {

                        return res !== null;
                    });

                if (!isInRedis) {
                    return h.response(403).code(403);
                }

                Jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
                    //TODO check against redis
                    if (err) {
                        return h.response(403).code(403);
                    }

                    newAccessToken = Jwt.sign(session, process.env.ACCESS_SECRET, { expiresIn: '5h' });
                });

                return h.response(newAccessToken);
            }
        },
        {
            method: 'POST',
            path: '/user/logout',
            config: {
                description: 'Invalidate httpOnly cookie',
                tags: ['api', 'users']
                // validate: {
                //     headers: Joi.object().keys({
                //         authorization: Joi.string().required()
                //     }).options({ allowUnknown: true })
                // }
            },

            handler: async function (request, h) {

                // let newAccessToken;
                const { refreshToken } = request.state;

                if (refreshToken === undefined) {
                    return h.response('No Refresh Token').code(401);
                }

                const userId = JwtDecode(refreshToken).id;

                // const isInRedis = await getRedisAsync(userId)
                //     .then((res) => {
                //
                //         return res !== null;
                //     });

                // if (!isInRedis) {
                //     return h.response('Not on the list of the valid sessions').unstate('refreshToken').code(403);
                // }

                const removedFromList = await delRedisAsync(userId);
                console.log(removedFromList);
                h.unstate('refreshToken', cookieOptions);
                return h.continue;
            }
        }
    ]);
};
