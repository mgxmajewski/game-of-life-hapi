'use strict';

const Jwt = require('jsonwebtoken');

const getTokenId = (token) => Jwt.verify(token, process.env.ACCESS_SECRET).id;

module.exports = {
    getTokenId
};
