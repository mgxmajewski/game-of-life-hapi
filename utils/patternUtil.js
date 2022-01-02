'use strict';

const Models = require('../model');

const Pattern = Models.patternsModel;
const PatternRecord = Models.patternRecordsModel;

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

    const PatternById = await Pattern.findByPk(pk);
    if (PatternById === null) {
        return null;
    }

    return PatternById;
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

const capturePattern = async (creator,snapshot_name, grid) => {

    console.log('Inside utils::PatternUtil.js::createPattern');
    let result = {};
    // console.log(`parseInt(id): ` + typeof parseInt(creator));
    const creatorUserId = parseInt(creator,10);
    console.log(`creatorUserId: ` + JSON.stringify(creatorUserId));
    console.log(`creatorUserId: ` + creatorUserId);
    try {
        const patternRecord = await PatternRecord.build({
            creator: creatorUserId,
            snapshot_name,
            pattern: grid
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



module.exports = {
    fetchPatterns,
    createPattern,
    fetchPatternByPk,
    capturePattern
};
