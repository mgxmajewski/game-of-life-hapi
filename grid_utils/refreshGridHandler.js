'use strict';

const { fetchGrid } = require('./fetchGridHandler');
const { parseGrid } = require('./parseGrid');
const { renderNextFrame } = require('./renderNextFrame');
const { sendGrid } = require('./sendGridHandler');

exports.gridRefreshHandler = async () => {

    try {
        const fetchedGrid = await fetchGrid();
        const parsedGrid = parseGrid(fetchedGrid);
        const nextFrame = renderNextFrame(parsedGrid);
        sendGrid(nextFrame);
    }
    catch (error) {
        console.log(new Error(error));
    }
};

