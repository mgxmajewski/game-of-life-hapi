'use strict';

const Connection = require('../dbConfig');

const authPlugin = {
    register: function (server, options) {

        module.exports.validate = async function (decoded, request, h) {
            // do your checks to see if the person is valid
            if (!await Connection.useModel.findByPk(decoded.id)) {
                return { isValid: false };
            }

            return { isValid: true };

        };
    },
    name: 'authPlugin'
};
module.exports = authPlugin;
