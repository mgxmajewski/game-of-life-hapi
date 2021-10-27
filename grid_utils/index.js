'use strict';

const { InitiateGrid } = require('./initiateGrid');
const { sendGrid } = require('./sendGridHandler');
const { updateInterval } = require('./intervalSetter');
const { gridRefreshHandler } = require('./refreshGridHandler');
const { handleClickedCell } = require('./clickCellHandler');
const { addLastRow, addLastColumn, addFirstRow, addFirstColumn, addColOrRowHandler } = require('./changeGameSizeHandler');

module.exports = {
    InitiateGrid,
    sendGrid,
    updateInterval,
    gridRefreshHandler,
    handleClickedCell,
    addLastRow,
    addLastColumn,
    addFirstRow,
    addFirstColumn,
    addColOrRowHandler
};
