'use strict';
const Hapi = require('@hapi/hapi');
const Connection = require('./dbConfig');
const { configureRoutes } = require('./routes');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
    await server.start();
    await configureRoutes(server);
    console.log('Server running on %s', server.info.uri);
    // console.log('What does server have to offer?');
    // for (let [key, value] of Object.entries(server)) {
    //     console.log(`${key}: ${value}`);
    // }
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
