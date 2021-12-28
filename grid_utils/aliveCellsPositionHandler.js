'use strict';

exports.moveAliveCellsRight = (parsedGrid, numOfAffected) => {

    const { columns, rows, aliveCells } = parsedGrid;
    aliveCells.forEach((coordinates) => coordinates[0] += numOfAffected);
    return { columns, rows, aliveCells };
};

exports.moveAliveCellsDown = (parsedGrid, numOfAffected) => {

    const { columns, rows, aliveCells } = parsedGrid;
    aliveCells.forEach((coordinates) => coordinates[1] += numOfAffected);
    return { columns, rows, aliveCells };
};

exports.moveAliveCellsLeft = (parsedGrid, numOfAffected) => {

    const { columns, rows, aliveCells } = parsedGrid;
    aliveCells.forEach((coordinates) => coordinates[0] -= numOfAffected);
    return { columns, rows, aliveCells };
};

exports.moveAliveCellsUp = (parsedGrid, numOfAffected) => {

    const { columns, rows, aliveCells } = parsedGrid;
    aliveCells.forEach((coordinates) => coordinates[1] -= numOfAffected);
    return { columns, rows, aliveCells };
};
