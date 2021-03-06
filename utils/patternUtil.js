'use strict';

const Models = require('../model');
// const { Sequelize } = require('sequelize');

const User = Models.usersModel;
const Pattern = Models.patternsModel;
const PatternRecord = Models.patternRecordsModel;



/**
 * @param {Model} model
 * @param {Integer} pk
 */

const findByPkDecorator = async (model, pk) => {

    const result = await model.findByPk(pk);
    if (result === null) {
        return null;
    }

    return result;
};

const fetchPatterns = async () => {

    console.log('Inside utils::patternUtil.js::fetchPatterns');
    try {
        return await Pattern.findAll({
            attributes: ['id','patternName']
        });

    }
    catch (err) {
        console.error(err);
        throw (err);
    }
};


const fetchPatternByPk = async (pk) => {

    return await findByPkDecorator(Pattern, pk);
};

const createPattern = async (name, grid) => {

    console.log('Inside utils::PatternUtil.js::createPattern');
    let result = {};
    try {
        const newPattern = await Pattern.build({
            patternName: name,
            pattern: grid
        }).save();
        await Pattern.sync();
        result = newPattern.toJSON();
    }
    catch (err) {
        console.error(err + 'Inside utils::PatternUtil.js');
        throw (err);
    }

    return { result };
};

const capturePattern = async (creator,snapshot_name, pattern) => {

    console.log('Inside utils::PatternUtil.js::createPattern');
    let result = {};
    // console.log(`parseInt(id): ` + typeof parseInt(creator));
    const creatorUserId = parseInt(creator,10);
    // console.log(`creatorUserId: ` + JSON.stringify(creatorUserId));
    // console.log(`creatorUserId: ` + creatorUserId);
    try {
        const patternRecord = await PatternRecord.build({
            creator: creatorUserId,
            snapshot_name,
            pattern
        }).save();
        await Pattern.sync();
        result = patternRecord.toJSON();
    }
    catch (err) {
        console.error(err + 'Inside utils::PatternUtil.js');
        throw (err);
    }

    return { result };
};

const fetchPatternRecords = async (id) => {

    console.log('Inside utils::patternUtil.js::fetchPatternRecords');
    try {
        return await PatternRecord.findAll({
            where: { creator: id },
            include: {
                model: User,
                attributes: ['id']
            },
            attributes: ['id','snapshot_name']
        });

    }
    catch (err) {
        console.error(err);
        throw (err);
    }
};

const fetchPatternRecordByPk = async (pk) => {

    return await findByPkDecorator(PatternRecord, pk);
};

module.exports = {
    fetchPatterns,
    createPattern,
    fetchPatternByPk,
    capturePattern,
    fetchPatternRecords,
    fetchPatternRecordByPk
};
