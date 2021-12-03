'use strict';

const Redis = require('redis');
const { promisify } = require('util');
const Jwt = require('jsonwebtoken');
const { tokenStitcher } = require('../grid_utils/tokenStitcher');

const redisClient = Redis.createClient();
const getRedisAsync = promisify(redisClient.get).bind(redisClient);

redisClient.set('key', 'value', Redis.print);
getRedisAsync('key').then((res) => console.log(res));

const authPlugin = {
    register: function (server, options) {

        module.exports.validate = async function (decoded, request, h) {

            const stitchedToken = tokenStitcher(request);
            const verifyToken = (token) => Jwt.verify(`${token}`, 'NeverShareYourSecret');
            const isValidJWT = verifyToken(stitchedToken);
            console.log(`verifyToken(stitchedToken): ` + isValidJWT);
            const isInRedis = await getRedisAsync(decoded.id)
                .then( (res) => {

                    return res !== null;
                });
            if (!isInRedis) {
                return { isValid: false };
            }

            return { isValid: true };
        };
    },
    name: 'authPlugin'
};
module.exports = authPlugin;
