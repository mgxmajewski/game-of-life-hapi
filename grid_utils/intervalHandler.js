'use strict';

let interval;
/**
 * @param {callback} cb - function which will be invoked in interval.
 * @param {number} timeOut - length of time interval given in milliseconds.
 */
exports.updateInterval = (cb, timeOut) => {

    clearInterval(interval);
    if (timeOut.toString() !== '101') {
        interval = setInterval(cb, timeOut);
    }
};
