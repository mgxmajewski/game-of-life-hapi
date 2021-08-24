class Cell {
    /**
     * @param x - coordinate (column)
     * @param y - coordinate (row)
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alive = false;
    }

    giveLife() {
        this.alive = true;
    }

    /**
     *
     * @return {boolean}
     */
    get isAlive() {
        return this.alive
    }

    /**
     *
     * @return {string}
     */
    get position() {
        return `position-${this.x}-${this.y}`
    }

    /**
     * Return x coordinate (column)
     * @return {number}
     */
    get xValue() {
        return this.x
    }

    /**
     * Return y coordinate (row)
     * @return {number}
     */
    get yValue() {
        return this.y
    }
}
module.exports = {Cell}
