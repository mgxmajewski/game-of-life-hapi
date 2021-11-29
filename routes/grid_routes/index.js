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

        const { token } = request.auth;
        const { timeout } = request.params;
        timeoutSetter(timeout);
        updateInterval(gridRefreshHandler, timeoutGetter(), token);
        return 'success';
    }
};

const clickedCellHandlerConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        const { cell, grid } = request.payload;
        const updatedGrid = handleClickedCell(grid, cell);
        const { token } = request.auth;
        sendGrid(updatedGrid, token);
        return 'changed clicked cell state';
    }
};

const addLastRowConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        const { token } = request.auth;
        return addColOrRowHandler(request, addLastRow, token);
    }
};

const addLastColConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        const { token } = request.auth;
        return addColOrRowHandler(request, addLastColumn, token);
    }
};

const addFirstRowConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        const { token } = request.auth;
        return addColOrRowHandler(request, addFirstRow, token);
    }
};

const addFirstColConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        const { token } = request.auth;
        return addColOrRowHandler(request, addFirstColumn, token);
    }
};

const initiateCleanGrid = {
    auth: 'jwt',
    handler: function (request, h) {

        const { payload } = request;
        const { columns, rows, aliveCells } = payload;
        const { token } = request.auth;
        const updatedGrid = InitiateGrid(columns, rows, aliveCells).cellGrid.gridView;
        console.log(updatedGrid);
        sendGrid(updatedGrid, token);
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
