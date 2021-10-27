'use strict';

const Connection = require('../model');

const authPlugin = {
    register: function (server, options) {

        module.exports.validate = async function (decoded, request, h) {
            // do your checks to see if the person is valid
            if (!await Connection.usersModel.findByPk(decoded.id)) {
                return { isValid: false };
            }

            return { isValid: true };

        };
    },
    name: 'authPlugin'
};
module.exports = authPlugin;
