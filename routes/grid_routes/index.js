'use strict';

const { useState } = require('../../helpers/useState');
const {
    InitiateGrid,
    sendGrid,
    updateInterval,
    gridRefreshHandler,
    handleClickedCell,
    addLastRow,
    addLastColumn,
    addFirstRow,
    addFirstColumn,
    addColOrRowHandler
} = require('../../grid_utils');


// Create hook to capture param from request to control interval timeout
const [timeoutGetter, timeoutSetter] = useState(3000);

const intervalHandlerConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        const { timeout } = request.params;
        timeoutSetter(timeout);
        updateInterval(gridRefreshHandler, timeoutGetter());
        return 'success';
    }
};

const clickedCellHandlerConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        const { cell, grid } = request.payload;
        const updatedGrid = handleClickedCell(grid, cell);
        sendGrid(updatedGrid);
        return 'changed clicked cell state';
    }
};

const addLastRowConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        return addColOrRowHandler(request, addLastRow);
    }
};

const addLastColConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        return addColOrRowHandler(request, addLastColumn);
    }
};

const addFirstRowConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        return addColOrRowHandler(request, addFirstRow);
    }
};

const addFirstColConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        return addColOrRowHandler(request, addFirstColumn);
    }
};

const initiateCleanGrid = {
    auth: 'jwt',
    handler: function (request, h) {

        const { payload } = request;
        const { columns, rows, aliveCells } = payload;
        const updatedGrid = InitiateGrid(columns, rows, aliveCells).cellGrid.gridView;
        console.log(updatedGrid);
        sendGrid(updatedGrid);
        return 'grid to mutate received';
    }
};

exports.configureGridRoutes = (server) => {

    return server.route([
        {
            method: 'POST',
            path: '/state/{timeout}',
            config: intervalHandlerConfig
        },
        {
            method: 'POST',
            path: '/mutate-grid/',
            config: clickedCellHandlerConfig
        },
        {
            method: 'POST',
            path: '/add-last-row/',
            config: addLastRowConfig
        },
        {
            method: 'POST',
            path: '/add-last-col/',
            config: addLastColConfig
        },
        {
            method: 'POST',
            path: '/add-first-row/',
            config: addFirstRowConfig
        },
        {
            method: 'POST',
            path: '/add-first-col/',
            config: addFirstColConfig
        },
        {
            method: 'POST',
            path: '/initiate-clean-grid/',
            config: initiateCleanGrid
        }
    ]);
};
