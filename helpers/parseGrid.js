'use strict';

const { getLongestRow } = require('./getLongestRow');

const numberOfRows = (parsedAxiosData) => parsedAxiosData.length;

exports.parseGrid = (parsedAxiosData) => {

    const rows = numberOfRows(parsedAxiosData);
    const columns = getLongestRow(parsedAxiosData);
    const aliveCells = [];
    // eslint-disable-next-line @hapi/for-loop
    for (let row = 0; row < rows; row++) {
        // const columns = parsedAxiosData[row].length;
        // eslint-disable-next-line @hapi/for-loop
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
