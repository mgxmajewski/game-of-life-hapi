'use strict';

const redisClient = require('redis-connection')(); // instantiate redis-connection
const Jwt = require('jsonwebtoken');

redisClient.set('redis', 'working');

const authPlugin = {
    register: function (server, options) {

        module.exports.validate = (decoded, request, h) => {

            console.log(' - - - - - - - DECODED token:');
            console.log(decoded);
            // do your checks to see if the session is valid against redis
            const redisLookup = () => {

                return redisClient.get(decoded.id, (redisError, reply) => {
                    /* istanbul ignore if */
                    if (redisError) {
                        console.log(redisError);
                    }

                    console.log(' - - - - - - - REDIS reply - - - - - - - ', reply);
                    let session;
                    if (reply) {
                        session = JSON.parse(reply);
                    }
                    else { // unable to find session in redis ... reply is null
                        return h(redisError, false);
                    }

                    if (session.valid === true) {
                        const tokenValid = Jwt.verify(session, 'NeverShareYourSecret');
                        console.log(tokenValid);
                        // if (tokenValid) {
                        return h(redisError, true);
                        // }
                    }

                    return h(redisError, false);

                });
            };

            if (!redisLookup()) {
                return { isValid: false };
            }

            return { isValid: true };
        };
    },
    name: 'authPlugin'
};
module.exports = authPlugin;
