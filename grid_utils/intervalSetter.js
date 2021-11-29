'use strict';

let interval;
/**
 * @param {function(*=): Promise<void>} cb - function which will be invoked in interval.
 * @param {number} timeOut - length of time interval given in milliseconds.
 * @param token
 */
exports.updateInterval = (cb, timeOut, token) => {

    clearInterval(interval);
    if (timeOut.toString() !== '101') {
        interval = setInterval(() => cb(token), timeOut);
    }
};
