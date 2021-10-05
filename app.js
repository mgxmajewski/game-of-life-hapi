'use strict';
const Hapi = require('@hapi/hapi');
// const Connection = require('./dbConfig');
// const { User } = require('./models/User');
const { configureRoutes } = require('./routes');
const Auth = require("./auth");

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
            validate : Auth.validate  // validate function defined above
        });

    // server.auth.default('jwt');

    await server.start();

    await configureRoutes(server);
    console.log('Server running on %s', server.info.uri);
};

// Connection.useModel.findAll().then(r => console.log(r))
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
