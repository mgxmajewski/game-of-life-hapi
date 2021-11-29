'use strict';

const Axios = require('axios');
const Config = require('../config');
const { getTokenId } = require('../utils/getTokenId');

const data = (id) => {

    return JSON.stringify({

        query: `query Session($sessionId: String) {
      sessions(id: $sessionId) {
        state
      }
    }`,
        variables: { 'sessionId': id }
    });
};

const configGetGrid = (id) => {

    return {
        method: 'post',
        url: `${Config.AppConfig.DEVELOPMENT.GQL_ENDPOINT}`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data(id)
    };
};

const getGridFromFetchedData = (FetchedFromAxios) => {

    const { state } = FetchedFromAxios.data.data.sessions;
    return state;
};

exports.fetchGrid = async (token) => {

    const id = getTokenId(token);
    const FetchedFromAxios = await Axios(configGetGrid(`${id}`));
    return getGridFromFetchedData(FetchedFromAxios);
};

