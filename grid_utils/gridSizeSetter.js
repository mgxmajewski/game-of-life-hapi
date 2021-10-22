'use strict';

exports.addRow = (parsedGrid) => {

    const { columns, aliveCells } = parsedGrid;
    let { rows } = parsedGrid;
    rows++;
    return { columns, rows, aliveCells };
};

exports.addColumn = (parsedGrid) => {

    const { rows, aliveCells } = parsedGrid;
    let { columns } = parsedGrid;
    columns++;
    return { columns, rows, aliveCells };
};

