'use strict';

const { fetchGrid } = require('./fetchGridHandler');
const { parseGrid } = require('./parseGrid');
const { renderNextFrame } = require('./renderNextFrame');
const { sendGrid } = require('./sendGridHandler');

exports.gridRefreshHandler = async (token) => {

    try {
        const fetchedGrid = await fetchGrid(token);
        const parsedGrid = parseGrid(fetchedGrid);
        const nextFrame = renderNextFrame(parsedGrid);
        sendGrid(nextFrame, token);
    }
    catch (error) {
        console.log(new Error(error));
    }
};

