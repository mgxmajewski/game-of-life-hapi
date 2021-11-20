'use strict';

const Redis = require('redis');
const { promisify } = require('util');

const redisClient = Redis.createClient();
const getRedisAsync = promisify(redisClient.get).bind(redisClient);

redisClient.set('key', 'value', Redis.print);
getRedisAsync('key').then((res) => console.log(res));

const authPlugin = {
    register: function (server, options) {

        module.exports.validate = async function (decoded, request, h) {

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
