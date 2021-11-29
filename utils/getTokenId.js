'use strict';

const Jwt = require('jsonwebtoken');

const getTokenId = (token) => Jwt.verify(token, 'NeverShareYourSecret').id;

module.exports = {
    getTokenId
};
