'use strict';

const Axios = require('axios');
const Config = require('../config');

const data = JSON.stringify({
    query: `query {
  states{
    grid
  } 
}`,
    variables: {}
});

const configGetGrid = {
    method: 'post',
    url: `${Config.AppConfig.DEVELOPMENT.GQL_ENDPOINT}`,
    headers: {
        'Content-Type': 'application/json'
    },
    data
};

const getGridFromFetchedData = (FetchedFromAxios) => {

    const states = FetchedFromAxios.data.data.states;
    const lastIndex = states.length - 1;
    return states[lastIndex].grid;
};

exports.fetchGrid = async () => {

    const FetchedFromAxios = await Axios(configGetGrid);
    return getGridFromFetchedData(FetchedFromAxios);
};

