'use strict';

const { GameOfLife } = require('../helpers/game_of_life_core/gameOfLife');

exports.InitiateGrid = (columns, rows, aliveCells) => {

    const grid = new GameOfLife(columns, rows);
    grid.initiateLife = aliveCells;
    return grid;
};
