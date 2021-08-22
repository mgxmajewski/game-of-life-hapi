'use strict';
const joi = require('joi');

// configure routes will be used in the main server.js file
// to get the corresponding server.js file.

const hello = {
    handler: function (request, h) {
        return 'Hello World!';
    }
};

exports.configureRoutes = (server) => {
    return server.route([
        {
            method: 'GET',
            path: '/',
            config: hello
        },
        {
            method:'POST',
            path:'/date/required',
            config: {
                validate: {
                    payload: joi.object({
                        from :joi.date().min('now').required(),
                        to:joi.date().greater(joi.ref('from')).required( )
                    })
                }
            },
            handler: (request, h) => {
                return request.payload;}
        }
    ])}
