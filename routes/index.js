'use strict';
const Joi = require('joi');

// configure routes will be used in the main server.js file
// to get the corresponding server.js file.

const hello = {
    handler: function (request, h) {
        return 'Hello World!';
    }
};

exports.configureRoutes = (server) =>{
return server.route([
    {
        method: 'GET',
        path: '/',
        config: hello
    } ])}
