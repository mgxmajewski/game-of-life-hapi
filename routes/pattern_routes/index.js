'use strict';

const {
    fetchPatterns,
    createPattern,
    fetchPatternByPk
} = require('../../utils/patternUtil');

const isSequelizeError = (err) => err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError';
const sequelizeErrorsResponse = (h, err) => {

    const errors = err.errors.map((err) => err.message);
    console.error('Ouch in Handler', errors);
    const data = {
        messages: errors
    };
    return h.response(data).code(419);
};

exports.configurePatternRoutes = (server) => {

    return server.route([
        {
            method: 'GET',
            path: '/all-patterns/get',
            config: {
                description: 'Get patterns',
                tags: ['api', 'patterns']
            },
            handler: async function (request, h) {

                try {
                    const allPatterns = await fetchPatterns();
                    console.log('success');
                    return allPatterns;
                }
                catch (err) {
                    console.error('Ouch in getPatterns', err);
                }
            }
        },
        {
            method: 'GET',
            path: '/pattern/{pk}',
            config: {
                description: 'Find Pattern By Pk',
                tags: ['api', 'pattern']
            },


            handler: async function (request, h) {

                let pattern = {};
                try {
                    console.log(request.params);
                    const { pk } = request.params;
                    pattern = await fetchPatternByPk(pk).then(
                        (patternFromDb) => {

                            return patternFromDb.pattern;
                        }).catch((err) => {

                        console.log('Throw Err From Handler');
                        throw err;
                    });

                }
                catch (err) {
                    console.error('Ouch in Handler', err);
                    return { response: err.errors };
                }

                return pattern;
            }
        },
        {
            method: 'POST',
            path: '/pattern/create',
            config: {
                description: 'Create pattern',
                tags: ['api', 'patterns']
            },
            handler: async function (request, h) {

                let newPattern = {};
                try {
                    console.log(`request.payload.pattern: ` + JSON.stringify(request.payload.pattern));
                    const patternFromReq = request.payload.pattern;
                    newPattern = await createPattern(
                        request.payload.patternName,
                        patternFromReq)
                        .then((createdNewPattern) => {

                            return h.response({ messages: [`Account successfully created`] }).code(200);
                        })
                        .catch((err) => {

                            console.log('Throw Err From SequelizeValidationError Handler');
                            throw err;
                        });

                }
                catch (err) {

                    if (isSequelizeError(err)) {
                        return sequelizeErrorsResponse(h, err);
                    }

                    return h.response({ messages: err.errors }).code(418);
                }

                return newPattern;
            }
        }
    ]);
};