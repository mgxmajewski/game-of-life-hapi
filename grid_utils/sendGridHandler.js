'use strict';

const Axios = require('axios');

const gridToPost = (grid) => {

    return JSON.stringify({
        query: `mutation ($grid: [[String]]!){
  postState(
    user: "MM", 
    grid: $grid
    )
}`,
        variables: { grid }
    });
};

const configPostGrid = (gridJSON) => {

    return {
        method: 'post',
        url: 'http://ubuntu2004.wsl:4000/',
        headers: {
            'Content-Type': 'application/json'
        },
        data: gridJSON
    };
};

const pushConfiguredGrid = (gridToSend) => {

    try {
        const dataToPost = gridToPost(gridToSend);
        const gridPostRequest = configPostGrid(dataToPost);
        return Axios(gridPostRequest);
    }
    catch (error) {
        console.log(new Error(error));
    }
};

exports.sendGrid = (gridToSend) => {

    pushConfiguredGrid(gridToSend);
};
