const {Cell} = require('./Cell.js')

class Grid {
    /**
     * Class Grid is used to create 2d grid of cells (which are instances
     * of Cell class).
     * Size of the grid is defined by arguments given to constructor.
     * State is kept in this.grid property and can be changed via accessCell method.
     * @param columns
     * @param rows
     */
    constructor(columns=10, rows=10) {
        this.columns = columns
        this.rows = rows
        this.grid = this.createGrid();
    }

    /**
     * Creates grid of cells.
     * Size of the grid is defined by rows and columns properties
     * from constructor.
     * @return {*[]}
     */
    createGrid() {
        const cells = [];
        for (let x = 0; x < this.columns; x++) {
            let rows = [];
            for (let y = 0; y < this.rows; y++) {
                const cell = new Cell(x,y);
                rows.push(cell);
            }
            cells.push(rows);
        }
        return cells;
    }

    /**
     * Calculates how many neighbour (surrounding) cells are alive.
     * Using convolution matrix this method iterate through
     * all 8 surrounding neighbours of analyzed cell and counts
     * how many neighbours are alive in actual state.
     * @param cell
     * @return {number}
     */
    analiseNeighbourCells(cell){
        let row = cell.yValue
        let col = cell.xValue
        let result = 0
        const rowBox = [row - 1, row, row + 1];
        const colBox = [col - 1, col, col + 1];
        for (let x = 0; x <= 2 ; x++){
            // Loops through (vertical) box_col - begins with -1 because matrix include preceding row
            for (let y = 0; y <= 2; y++){
                // Declare analyzed cells position relative to box
                let x_box = colBox[y];
                let y_box = rowBox[x];
                // Adds condition to exclude cells outside Grid which are "forced" by 3x3 box
                if ((x_box >= 0 && x_box < this.columns) && (y_box >= 0 && y_box < this.rows)) {
                    const neighbourCell = this.accessCell(x_box, y_box)
                    // console.log(neighbourCell)
                    if(neighbourCell.isAlive&&neighbourCell!==cell){
                        result++
                    }
                }
            }
        }
        return result
    }

    /**
     * Display size of the Grid
     * @return {string}
     */
    get size() {
        return `columns: ${this.columns}, rows: ${this.rows}`
    }

    /**
     * Gives access to particular cell
     * from the Grid
     * @param x
     * @param y
     * @return {Cell}
     */
    accessCell(x,y){
        return this.grid[x][y]
    }

    /**
     * Generates view of the grid.
     * Returned view is a set of 2d array where:
     * - Dead cells are represented by '_'
     * - Alive cells are represented by '#'
     * @return {*[]}
     */
    get gridView() {
        const gridView = [];
        for (let y = 0; y < this.rows; y++){
            const rows = [];
            for(let x = 0; x < this.columns; x++){
                const spaceVisual = '_'
                const lifeVisual = '#'
                if(this.grid[x][y].isAlive){
                    rows.push(lifeVisual);
                } else {
                    rows.push(spaceVisual);
                }
            }
            gridView.push(rows);
        }
        return gridView
    }
}

module.exports = {Grid}
