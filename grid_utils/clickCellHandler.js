'use strict';

exports.handleClickedCell = (grid, cell) => {

    const x = cell[1];
    const y = cell[0];
    // console.log(cell)
    const isAlive = grid[x][y] === '#';
    grid[x][y] = isAlive ? '_' : '#';
    return grid;
};

