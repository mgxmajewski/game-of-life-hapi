'use strict';

exports.moveAliveCellsRight = (parsedGrid) => {

    const { columns, rows, aliveCells } = parsedGrid;
    aliveCells.forEach((coordinates) => coordinates[0]++);
    return { columns, rows, aliveCells };
};

exports.moveAliveCellsDown = (parsedGrid) => {

    const { columns, rows, aliveCells } = parsedGrid;
    aliveCells.forEach((coordinates) => coordinates[1]++);
    return { columns, rows, aliveCells };
};

exports.moveAliveCellsLeft = (parsedGrid) => {

    const { columns, rows, aliveCells } = parsedGrid;
    aliveCells.forEach((coordinates) => coordinates[0]--);
    return { columns, rows, aliveCells };
};

exports.moveAliveCellsUp = (parsedGrid) => {

    const { columns, rows, aliveCells } = parsedGrid;
    aliveCells.forEach((coordinates) => coordinates[1]--);
    return { columns, rows, aliveCells };
};