'use strict';

const Axios = require('axios');

const gridToPost = (grid) => {

    return JSON.stringify({
        query: `mutation ($grid: [[String]]!){
  postState(
    grid: $grid
    )
}`,
        variables: { grid }
    });
};

const configPostGrid = (gridJSON, authToken) => {

    return {
        method: 'post',
        url: `${process.env.GQL_ENDPOINT}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${authToken}`
        },
        data: gridJSON
    };
};

const pushConfiguredGrid = (gridToSend, authToken) => {

    try {
        const dataToPost = gridToPost(gridToSend);
        const gridPostRequest = configPostGrid(dataToPost, authToken);
        return Axios(gridPostRequest);
    }
    catch (error) {
        console.log(new Error(error));
    }
};

exports.sendGrid = (gridToSend, authToken) => {

    pushConfiguredGrid(gridToSend, authToken);
};
