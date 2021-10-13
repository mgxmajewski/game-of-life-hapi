'use strict';

exports.getLongestRow = (grid) => {

    let max = 0;
    // eslint-disable-next-line @hapi/for-loop
    for (let row = 0; row < grid.length; row++) {
        if (max < grid[row].length) {
            max = grid[row].length;
        }
    }

    return max;
};
