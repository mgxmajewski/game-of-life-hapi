'use strict';

require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Fs = require('fs');
const {configureGridRoutes} = require('./routes/grid_routes');
const {configureUserRoutes} = require('./routes/user_routes');
const {configurePatternRoutes} = require('./routes/pattern_routes');
const Auth = require('./auth');

const init = async () => {

    const DEFAULT_HOST = 'localhost';
    const DEFAULT_PORT = 3000;
    const RADIX = 10;


    const server = Hapi.Server(
        {
            state: {
                isSecure: true,
                isHttpOnly: true,
                isSameSite: 'None'
            },
            host: process.env.HAPI_HOST || DEFAULT_HOST,
            port: parseInt(process.env.PORT, RADIX) || DEFAULT_PORT,
            routes: {
                cors: {
                    origin: ['*'],
                    credentials: true
                }
            }
        });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Hello World! API NEW';
        }
    });


    await server.register(require('hapi-auth-jwt2'));
    await server.register(require('./auth'));
    server.auth.strategy('jwt', 'jwt',
        {
            key: process.env.ACCESS_SECRET, // Never Share your secret key
            validate: Auth.validate  // validate function defined above
        });

    // server.auth.default('jwt');

    await server.start();

    await configureGridRoutes(server);
    await configureUserRoutes(server);
    await configurePatternRoutes(server);
    console.log('Server running on %s', server.info.uri);
    // console.log(`${server}`);
};

// eslint-disable-next-line @hapi/scope-start
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
