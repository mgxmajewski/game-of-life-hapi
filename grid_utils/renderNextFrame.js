'use strict';

const { InitiateGrid } = require('./initiateGrid');

exports.renderNextFrame = (parsedGrid) => {

    const { rows, columns, aliveCells } = parsedGrid;
    const grid = InitiateGrid(columns, rows, aliveCells);
    grid.updateGrid();
    return grid.cellGrid.gridView;
};
