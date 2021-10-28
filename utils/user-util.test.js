'use strict';

const {
    fetchUsers,
    findUsers,
    findPk
} = require('./userUtil');

jest.mock('../model/User', () => () => {

    const SequelizeMock = require('sequelize-mock-v5');

    const dbMock = new SequelizeMock();
    const UserMock = dbMock.define('Users',  {
        id: 2,
        userName: 'good',
        emailAddress: 'xyz@abc.com',
        password: 'test'
    });

    UserMock.$queryInterface.$useHandler((query, queryOptions, done) => {

        if (query === 'findAll') {
            const symbolAccess = (obj) => Object.getOwnPropertySymbols(obj);
            if (queryOptions[0].attributes[0] === 'id' ) {
                UserMock.$queueResult( [UserMock.build({ id: 0 }), UserMock.build({ id: 2 })] );
            }
            else if (queryOptions[0].where.userName[symbolAccess(queryOptions[0].where.userName)[0]] === 'MM' ) {
                return UserMock.build({ userName: 'Found userName' });
            }
        }

        if (query === 'findById') {
            if (queryOptions[0] === 2) {
            // Result found, return it
                return UserMock.build({ userName: 'pk Found' });
            }

            // No results
            return null;

        }
    });

    return UserMock;
});

describe('UserUtil', () => {

    test('should check if fetchUsers returns data', async () => {
        // Given
        const testFetch = await fetchUsers();
        const result = testFetch.listUsers.length;
        // Then
        expect(result).toBe(2);
    });

    test('should return given user', async () => {
        // Given
        const testFindUsers = await findUsers('MM','');
        const result = testFindUsers.listUsers.dataValues.userName;
        // Then
        expect(result).toBe('Found userName');
    });

    test('should return byPK', async () => {
        // Given
        const testFindUsers = await findPk(2);
        const result = testFindUsers.listUsers.dataValues.userName;
        // Then
        expect(result).toBe('pk Found');
    });
});
