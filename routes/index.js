'use strict';

const { useState } = require('../helpers/useState');
const { parseGrid } = require('../grid_utils/parseGrid');
const { InitiateGrid } = require('../grid_utils/initiategrid');
const { sendGrid } = require('../grid_utils/sendGridHandler');
const { updateInterval } = require('../grid_utils/intervalSetter');
const { gridRefreshHandler } = require('../grid_utils/refreshGridHandler');
const { handleClickedCell } = require('../grid_utils/clickCellHandler');

const addRow = (parsedGrid) => {

    const { columns, aliveCells } = parsedGrid;
    let { rows } = parsedGrid;
    rows++;
    return { columns, rows, aliveCells };
};

const addColumn = (parsedGrid) => {

    const { rows, aliveCells } = parsedGrid;
    let { columns } = parsedGrid;
    columns++;
    return { columns, rows, aliveCells };
};

const addLastRow = (parsedGrid) => {

    const { columns, rows, aliveCells } = addRow(parsedGrid);
    const grid = InitiateGrid(columns, rows, aliveCells);
    console.log(grid.cellGrid.gridView);
    return grid.cellGrid.gridView;
};

const addLastColumn = (parsedGrid) => {

    const { rows, columns, aliveCells } = addColumn(parsedGrid);
    const grid = InitiateGrid(columns, rows, aliveCells);
    return grid.cellGrid.gridView;
};

const moveAliveCellsRight = (parsedGrid) => {

    const { columns, rows, aliveCells } = parsedGrid;
    aliveCells.forEach((coordinates) => coordinates[0]++);
    return { columns, rows, aliveCells };
};

const moveAliveCellsDown = (parsedGrid) => {

    const { columns, rows, aliveCells } = parsedGrid;
    aliveCells.forEach((coordinates) => coordinates[1]++);
    return { columns, rows, aliveCells };
};

const addFirstRow = (parsedGrid) => {

    const gridWithAddedRow = addRow(parsedGrid);
    const { columns, rows, aliveCells } = moveAliveCellsDown(gridWithAddedRow);
    console.log({ columns, rows, aliveCells });
    const grid = InitiateGrid(columns, rows, aliveCells);
    return grid.cellGrid.gridView;
};

const addFirstColumn = (parsedGrid) => {

    const gridWithAddedColumn = addColumn(parsedGrid);
    const { columns, rows, aliveCells } = moveAliveCellsRight(gridWithAddedColumn);
    const grid = InitiateGrid(columns, rows, aliveCells);
    return grid.cellGrid.gridView;
};

// Create hook to capture param from request to control interval timeout
const [timeoutGetter, timeoutSetter] = useState(3000);

const qclState = {
    auth: 'jwt',
    handler: function (request, h) {

        const timeOutParam = request.params.timeout;
        timeoutSetter(timeOutParam);
        updateInterval(gridRefreshHandler, timeoutGetter());
        console.log(h.request.params.timeout);
        return 'success';
    }
};

const clickedCellHandlerConfig = {
    auth: 'jwt',
    handler: function (request, h) {

        const { cell, grid } = request.payload;
        const updatedGrid = handleClickedCell(grid, cell);
        // console.log(request.payload)
        sendGrid(updatedGrid);
        return 'changed clicked cell state';
    }
};

const addColOrRowHandler = (request, addHandler) => {

    const payload = request.payload;
    const parsedGrid = parseGrid(payload.grid);
    const updatedGrid = addHandler(parsedGrid);
    sendGrid(updatedGrid);
    return `handled ${addHandler}`;
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

exports.configureRoutes = (server) => {

    return server.route([
        {
            method: 'POST',
            path: '/state/{timeout}',
            config: qclState
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
