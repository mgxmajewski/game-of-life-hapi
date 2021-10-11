'use strict';

const { getLongestRow } = require('./getLongestRow');

exports.parseGrid = (parsedAxiosData) => {
    const rows = parsedAxiosData.length;
    const columns = getLongestRow(parsedAxiosData);
    const aliveCells = [];
    for (let row = 0; row < rows; row++) {
        const columns = parsedAxiosData[row].length;
        for (let col = 0; col < columns; col++) {
            const currentCell = parsedAxiosData[row][col];
            if ( currentCell === '#') {
                // coords as they will be retrieved backwards
                const coords = [col, row];
                aliveCells.push(coords);
            }
        }
    }

    return { columns, rows, aliveCells };
};
