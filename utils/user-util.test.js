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
    }, {
        instanceMethods: {
            testFunc: function () {
                return this.get('id');
            }
        }
    });

    UserMock.findOne({
        where: {
            userName: 'good'
        }
    }).then((user) => {
    // `user` is a Sequelize Model-like object
        console.log(user);
        user.get('id');         // Auto-Incrementing ID available on all Models
        user.get('email');      // 'email@example.com'; Pulled from default values
        user.get('username');   // 'my-user'; Pulled from the `where` in the query
        console.log('popo'+ user.testFunc());
        user.testFunc();      // Will return 'Test User' as defined above

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
        console.log(testFindUsers);
        // Then
        expect(testFindUsers).not.toBe(undefined);
    });

    test('should return byPK', async () => {
        // Given
        const testFindUsers = await findPk(3);
        console.log(testFindUsers);
        // Then
        expect(testFindUsers).not.toBe(undefined);
    });
});
