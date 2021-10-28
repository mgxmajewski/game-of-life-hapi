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
        password: 'testpassword'
    });

    UserMock.$queryInterface.$useHandler((query, queryOptions, done) => {

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
        // Then
        expect(testFetch).not.toBe(undefined);
    });

    test('should return given user', async () => {
        // Given
        const testFindUsers = await findUsers('MM','');
        // console.log(testFindUsers);
        // Then
        expect(testFindUsers).not.toBe(undefined);
    });

    test('should return byPK', async () => {
        // Given
        const testFindUsers = await findPk(2);
        const result = testFindUsers.listUsers.dataValues.userName;
        // Then
        expect(result).toBe('pk Found');
    });
});
