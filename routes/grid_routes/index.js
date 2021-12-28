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
    deleteLastRow,
    deleteLastColumn,
    deleteFirstRow,
    deleteFirstColumn,
    gridResizeHandler
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
        const { affected } = request.params;

        return gridResizeHandler(request, addLastRow, parseInt(affected), token);
    }
};

const addLastColConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        const { token } = request.auth;
        const { affected } = request.params;

        return gridResizeHandler(request, addLastColumn, parseInt(affected), token);
    }
};

const addFirstRowConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        const { token } = request.auth;
        const { affected } = request.params;

        return gridResizeHandler(request, addFirstRow, parseInt(affected), token);
    }
};

const addFirstColConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        const { token } = request.auth;
        const { affected } = request.params;
        console.log(`affected: ` + affected);

        return gridResizeHandler(request, addFirstColumn, parseInt(affected), token);
    }
};

const deleteLastRowConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        const { token } = request.auth;
        const { affected } = request.params;

        return gridResizeHandler(request, deleteLastRow, parseInt(affected), token);
    }
};

const deleteLastColConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        const { token } = request.auth;
        const { affected } = request.params;

        return gridResizeHandler(request, deleteLastColumn, parseInt(affected), token);
    }
};

const deleteFirstRowConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        const { token } = request.auth;
        const { affected } = request.params;

        return gridResizeHandler(request, deleteFirstRow, parseInt(affected), token);
    }
};

const deleteFirstColConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        const { token } = request.auth;
        const { affected } = request.params;

        return gridResizeHandler(request, deleteFirstColumn, parseInt(affected), token);
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
            path: '/add-last-row/{affected}',
            config: addLastRowConfig
        },
        {
            method: 'POST',
            path: '/add-last-col/{affected}',
            config: addLastColConfig
        },
        {
            method: 'POST',
            path: '/add-first-row/{affected}',
            config: addFirstRowConfig
        },
        {
            method: 'POST',
            path: '/add-first-col/{affected}',
            config: addFirstColConfig
        },
        {
            method: 'POST',
            path: '/delete-last-row/{affected}',
            config: deleteLastRowConfig
        },
        {
            method: 'POST',
            path: '/delete-last-col/{affected}',
            config: deleteLastColConfig
        },
        {
            method: 'POST',
            path: '/delete-first-row/{affected}',
            config: deleteFirstRowConfig
        },
        {
            method: 'POST',
            path: '/delete-first-col/{affected}',
            config: deleteFirstColConfig
        },
        {
            method: 'POST',
            path: '/initiate-clean-grid/',
            config: initiateCleanGrid
        }
    ]);
};
