'use strict';

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
        url: 'http://localhost:4000/',
        headers: {
            'Content-Type': 'application/json'
        },
        data: gridJSON
    };
};

exports.configuredPost = (nextFrame) => {

    const dataToPost = gridToPost(nextFrame);
    return configPostGrid(dataToPost);
};
