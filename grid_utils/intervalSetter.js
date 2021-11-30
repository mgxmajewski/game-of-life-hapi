'use strict';

const { getTokenId } = require('../utils/getTokenId');

const intervals = {};

/**
 * @param {function(*=): Promise<void>} cb - function which will be invoked in interval.
 * @param {number} timeOut - length of time interval given in milliseconds.
 * @param token
 */

exports.updateInterval = (cb, timeOut, token) => {

    const interval = getTokenId(token);
    clearInterval(intervals[interval]);
    if (timeOut.toString() !== '101') {
        intervals[interval] = setInterval(() => cb(token), timeOut);
    }
};
