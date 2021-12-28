'use strict';

const { InitiateGrid } = require('./initiateGrid');
const { sendGrid } = require('./sendGridHandler');
const { updateInterval } = require('./intervalSetter');
const { gridRefreshHandler } = require('./refreshGridHandler');
const { handleClickedCell } = require('./clickCellHandler');
const {
    addLastRow,
    addLastColumn,
    addFirstRow,
    addFirstColumn,
    addColOrRowHandler,
    deleteLastRow,
    deleteLastColumn,
    deleteFirstRow,
    deleteFirstColumn
} = require('./changeGameSizeHandler');
const { tokenStitcher } = require('./tokenStitcher');

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
    deleteLastRow,
    deleteLastColumn,
    deleteFirstRow,
    deleteFirstColumn,
    addColOrRowHandler,
    tokenStitcher
};
