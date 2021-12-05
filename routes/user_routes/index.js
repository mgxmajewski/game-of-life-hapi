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
                        (userFound) => {

                            return userFound;
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
                    newUser = await registerUser(request.payload.userName,
                        request.payload.password, request.payload.emailAddress).then(
                        (registeredNewUser) => {

                            return registeredNewUser;
                        }).catch((err) => {

                        console.log('Throw Err From Handler');
                        throw err;
                    });

                }
                catch (err) {
                    console.error('Ouch in Handler', err);
                    return { response: err.errors };
                }

                return newUser;
            }
        }
        ,
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

                let AuthUser = {};
                try {
                    AuthUser = await findUserToAuth(emailAddress).then(
                        (userFound) => {

                            console.log(`1: ${userFound.password}, 2: ${password}`);
                            const userIsAuth = Bcrypt.compare(password, userFound.password);
                            if (userIsAuth) {
                                const session = {
                                    id: userFound.id
                                    // id: uuidv4() // a random session id
                                    // valid: true // this will be set to false when the person logs out
                                    // exp: new Date().getTime() + 5 * 1000 // expires in 30 minutes time
                                };
                                // create the session in Redis
                                redisClient.set(userFound.id, JSON.stringify(session));
                                const accessToken = Jwt.sign(session, process.env.ACCESS_SECRET, { expiresIn: '12h' });
                                const refreshToken = Jwt.sign(session, process.env.REFRESH_SECRET);
                                return h.response(accessToken).state('refreshToken', refreshToken, cookieOptions);
                            }

                            return h.response('401');


                        }).catch((err) => {

                        console.log('Throw Err From Handler');
                        throw err;
                    });

                }
                catch (err) {
                    console.error('Ouch in Handler', err);
                    return { response: err.errors };
                }

                return AuthUser;
            }
        },
        {
            method: 'POST',
            path: '/user/refresh-token',
            config: {
                description: 'RefreshToken',
                tags: ['api', 'users'],
                validate: {
                    headers: Joi.object().keys({
                        authorization: Joi.string().required()
                    }).options({ allowUnknown: true })
                }
            },

            handler: async function (request, h) {

                let newAccessToken;
                const { refreshToken } = request.state;

                if (refreshToken === null) {
                    return h.response(401);
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
                    return h.response(403);
                }

                Jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {

                    if (err) {
                        return h.response(403);
                    }

                    newAccessToken = Jwt.sign(session, process.env.ACCESS_SECRET, { expiresIn: '12h' });
                });

                return h.response(newAccessToken);
            }
        }
    ]);
};
