'use strict';

exports.getLongestRow = (grid) => {

    let maxRowLength = 0;
    // eslint-disable-next-line @hapi/for-loop
    for (let row = 0; row < grid.length; row++) {
        const currentRowLength = grid[row].length;
        if (maxRowLength < currentRowLength) {
            maxRowLength = currentRowLength;
        }
    }

    return maxRowLength;
};
