'use strict';

const { addRow, addColumn } = require('./gridSizeSetter');
const { InitiateGrid } = require('./initiateGrid');
const { moveAliveCellsDown, moveAliveCellsRight } = require('./aliveCellsPositionHandler');
const { sendGrid } = require('./sendGridHandler');
const { parseGrid } = require('./parseGrid');

exports.addLastRow = (parsedGrid) => {

    const { columns, rows, aliveCells } = addRow(parsedGrid);
    const grid = InitiateGrid(columns, rows, aliveCells);
    console.log(grid.cellGrid.gridView);
    return grid.cellGrid.gridView;
};

exports.addLastColumn = (parsedGrid) => {

    const { rows, columns, aliveCells } = addColumn(parsedGrid);
    const grid = InitiateGrid(columns, rows, aliveCells);
    return grid.cellGrid.gridView;
};

exports.addFirstRow = (parsedGrid) => {

    const gridWithAddedRow = addRow(parsedGrid);
    const { columns, rows, aliveCells } = moveAliveCellsDown(gridWithAddedRow);
    console.log({ columns, rows, aliveCells });
    const grid = InitiateGrid(columns, rows, aliveCells);
    return grid.cellGrid.gridView;
};

exports.addFirstColumn = (parsedGrid) => {

    const gridWithAddedColumn = addColumn(parsedGrid);
    const { columns, rows, aliveCells } = moveAliveCellsRight(gridWithAddedColumn);
    const grid = InitiateGrid(columns, rows, aliveCells);
    return grid.cellGrid.gridView;
};


exports.addColOrRowHandler = (request, addHandler) => {

    const payload = request.payload;
    const parsedGrid = parseGrid(payload.grid);
    const updatedGrid = addHandler(parsedGrid);
    sendGrid(updatedGrid);
    return `handled ${addHandler}`;
};


