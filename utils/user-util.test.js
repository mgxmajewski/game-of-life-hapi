'use strict';

const {
    fetchUsers
} = require('./userUtil');

jest.mock('../model/User', () => () => {

    const SequelizeMock = require('sequelize-mock');

    const dbMock = new SequelizeMock();
    return dbMock.define('Users',  {
        id: 2,
        userName: 'good',
        emailAddress: 'xyz@abc.com',
        password: 'testpassword'
    });
});

describe('UserUtil', () => {

    test('should check if fetchUsers returns data', async () => {
        // Given
        const testFetch = await fetchUsers();
        console.log(testFetch.listUsers);
        // Then
        expect(testFetch).not.toBe(undefined);
    });
});
