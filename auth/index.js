'use strict';
const authPlugin = {
    register: function (server, options) {
        const people = { // our "users database"
            1: {
                id: 1,
                name: 'Jen Jones'
            }
        };
        module.exports.validate = async function (decoded, request, h) {
            // do your checks to see if the person is valid
            if (!people[decoded.id]) {
                return { isValid: false };
            }
            else {
                return { isValid: true };
            }
        };
    },
    name: 'authPlugin'
}
module.exports = authPlugin
