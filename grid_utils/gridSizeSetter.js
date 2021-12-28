'use strict';

exports.addRow = (parsedGrid, numOfAffected) => {

    const { columns, aliveCells } = parsedGrid;
    let { rows } = parsedGrid;
    rows += numOfAffected;
    return { columns, rows, aliveCells };
};

exports.addColumn = (parsedGrid, numOfAffected) => {

    const { rows, aliveCells } = parsedGrid;
    let { columns } = parsedGrid;
    columns += numOfAffected;
    return { columns, rows, aliveCells };
};

exports.deleteRow = (parsedGrid, numOfAffected) => {

    const { columns, aliveCells } = parsedGrid;
    let { rows } = parsedGrid;
    rows -= numOfAffected;
    return { columns, rows, aliveCells };
};

exports.deleteColumn = (parsedGrid, numOfAffected) => {

    const { rows, aliveCells } = parsedGrid;
    let { columns } = parsedGrid;
    columns -= numOfAffected;
    return { columns, rows, aliveCells };
};
