'use strict';

exports.tokenStitcher = (request) => {

    const tokenAuth = request.headers.authorization;
    const splitToken = tokenAuth.split('.');
    const headerAndPayload = `${splitToken[0]}.${splitToken[1]}`;
    const signatureCookie = request.state.signature;
    return `${headerAndPayload}${signatureCookie}`;
};

