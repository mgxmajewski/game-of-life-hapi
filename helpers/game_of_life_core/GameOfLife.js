'use strict';

const { Grid } = require('./Grid.js');

class GameOfLife {
    constructor(columns, rows) {
        this.columns = columns;
        this.rows = rows;
        this.grid = new Grid(columns, rows);
        this.initiateLife = [];
    }

    /**
     * Returns actual grid
     * @return {Object} Grid
     */
    get cellGrid() {
        return this.grid;
    }

    /**
     * Revives all cells specified in provided argument.
     * Uses Cell objects accessCell method using provided
     * x,y coordinates (each array is one cell) to revive
     * each cell by using giveLife method
     * @param initialLife {Array} - array of arrays
     */
    set initiateLife(initialLife) {
        for (let cell = 0; cell < initialLife.length; cell++) {
            const x = initialLife[cell][0];
            const y = initialLife[cell][1];
            const spaceToRevive = this.cellGrid.accessCell(x,y);
            spaceToRevive.giveLife();
        }
    }

    /**
     * Updates Grid
     * @param {Grid} updatedGrid
     */
    set updatedGrid(updatedGrid) {
        this.grid = updatedGrid;
    }

    /**
     * Computes next state of the Grid.
     * Initially creates blank temporary Grid (all cells dead) and according
     * to rules of Conway's Game of Life revive cells. No cells need to be killed
     * because they are dead by default in initiated tempGrid.
     *
     * Only two of four rules need need to be applied to achieve correct state:
     *  3. Any live cell with two or three live neighbours lives on to the next generation.
     *  4. Any dead cell with exactly three live neighbours becomes a live cell.
     *
     * In this method analiseNeighbourCells method of actual Grid is called which returns
     * number required for decision making. Cells which are decided to be revived are yielded
     * in cellsToRevive array. It is provided as argument to initiateLife setter.
     */
    updateGrid() {
        const cellsToRevive = [];
        for (let x = 0; x < this.columns; x++) {
            for (let y = 0; y < this.rows; y++) {
                const cellAnalysed = this.grid.accessCell(x,y);
                const cellAnalysisResult = this.grid.analiseNeighbourCells(cellAnalysed);
                if (cellAnalysisResult === 3) {
                    cellsToRevive.push([x,y]);
                }
                else if ((cellAnalysisResult === 3 || cellAnalysisResult === 2) && cellAnalysed.isAlive) {
                    cellsToRevive.push([x,y]);
                }
            }
        }

        this.updatedGrid = new Grid(this.columns, this.rows);
        this.initiateLife = cellsToRevive;
    }
}

module.exports = { GameOfLife };
