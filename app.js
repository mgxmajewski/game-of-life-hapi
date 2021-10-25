'use strict';

const Hapi = require('@hapi/hapi');
const { configureGridRoutes } = require('./routes/grid_routes');
const Auth = require('./auth');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: true
        }
    });


    await server.register(require('hapi-auth-jwt2'));
    await server.register(require('./auth'));
    server.auth.strategy('jwt', 'jwt',
        { key: 'NeverShareYourSecret', // Never Share your secret key
            validate: Auth.validate  // validate function defined above
        });

    // server.auth.default('jwt');

    await server.start();

    await configureGridRoutes(server);
    console.log('Server running on %s', server.info.uri);
};

// eslint-disable-next-line @hapi/scope-start
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
