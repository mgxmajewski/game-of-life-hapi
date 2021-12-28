'use strict';

const {
    addRow,
    addColumn,
    deleteRow,
    deleteColumn
} = require('./gridSizeSetter');
const { InitiateGrid } = require('./initiateGrid');
const {
    moveAliveCellsDown,
    moveAliveCellsRight,
    moveAliveCellsUp,
    moveAliveCellsLeft
} = require('./aliveCellsPositionHandler');
const { sendGrid } = require('./sendGridHandler');
const { parseGrid } = require('./parseGrid');

exports.addLastRow = (parsedGrid, numOfAffected) => {

    const { columns, rows, aliveCells } = addRow(parsedGrid,numOfAffected);
    const grid = InitiateGrid(columns, rows, aliveCells);
    // console.log(grid.cellGrid.gridView);
    return grid.cellGrid.gridView;
};

exports.addLastColumn = (parsedGrid, numOfAffected) => {

    const { rows, columns, aliveCells } = addColumn(parsedGrid, numOfAffected);
    const grid = InitiateGrid(columns, rows, aliveCells);
    return grid.cellGrid.gridView;
};

exports.addFirstRow = (parsedGrid, numOfAffected) => {

    const gridWithAddedRow = addRow(parsedGrid, numOfAffected);
    const { columns, rows, aliveCells } = moveAliveCellsDown(gridWithAddedRow, numOfAffected);
    // console.log({ columns, rows, aliveCells });
    const grid = InitiateGrid(columns, rows, aliveCells);
    return grid.cellGrid.gridView;
};

exports.addFirstColumn = (parsedGrid, numOfAffected) => {

    const gridWithAddedColumn = addColumn(parsedGrid, numOfAffected);
    const { columns, rows, aliveCells } = moveAliveCellsRight(gridWithAddedColumn, numOfAffected);
    const grid = InitiateGrid(columns, rows, aliveCells);
    return grid.cellGrid.gridView;
};

exports.deleteLastRow = (parsedGrid, numOfAffected) => {

    const { columns, rows, aliveCells } = deleteRow(parsedGrid, numOfAffected);
    const grid = InitiateGrid(columns, rows, aliveCells);
    // console.log(grid.cellGrid.gridView);
    return grid.cellGrid.gridView;
};

exports.deleteLastColumn = (parsedGrid, numOfAffected) => {

    const { rows, columns, aliveCells } = deleteColumn(parsedGrid, numOfAffected);
    const grid = InitiateGrid(columns, rows, aliveCells);
    return grid.cellGrid.gridView;
};

exports.deleteFirstRow = (parsedGrid, numOfAffected) => {

    const gridWithAddedRow = deleteRow(parsedGrid, numOfAffected);
    const { columns, rows, aliveCells } = moveAliveCellsUp(gridWithAddedRow, numOfAffected);
    // console.log({ columns, rows, aliveCells });
    const grid = InitiateGrid(columns, rows, aliveCells);
    return grid.cellGrid.gridView;
};

exports.deleteFirstColumn = (parsedGrid, numOfAffected) => {

    const gridWithAddedColumn = deleteColumn(parsedGrid, numOfAffected);
    const { columns, rows, aliveCells } = moveAliveCellsLeft(gridWithAddedColumn, numOfAffected);
    const grid = InitiateGrid(columns, rows, aliveCells);
    return grid.cellGrid.gridView;
};

exports.gridResizeHandler = (request, addHandler, numOfAffected, token) => {

    const payload = request.payload;
    const parsedGrid = parseGrid(payload.grid);
    const updatedGrid = addHandler(parsedGrid, numOfAffected);
    sendGrid(updatedGrid, token);
    return `handled ${addHandler}`;
};


