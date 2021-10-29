'use strict';

const {
    fetchUsers,
    findUsers,
    fetchUserByPk,
    registerUser, findUserToAuth
} = require('./userUtil');

jest.mock('../model/User', () => () => {

    const SequelizeMock = require('sequelize-mock-v5');

    const dbMock = new SequelizeMock();
    const UserMock = dbMock.define('Users',  {
        id: 1,
        userName: 'goodOne',
        emailAddress: 'xyz@abc.com',
        password: 'test'
    });

    UserMock.$queryInterface.$useHandler((query, queryOptions, done) => {

        if (query === 'findAll') {
            const symbolAccess = (obj) => Object.getOwnPropertySymbols(obj);
            if (queryOptions[0].attributes[0] === 'id' ) {
                return UserMock.$queueResult( [UserMock.build({ id: 0 }), UserMock.build({ id: 2 })] );
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
        }

        if (query === 'findOne') {
            if (queryOptions[0].where.emailAddress === 'xyz@wzy.com') {
                // Result found, return it
                return UserMock.build({ userName: 'Email Found' });
            }
        }

        if (query === 'build') {
            // Result found, return it
            return UserMock.build();
        }

        // No results
        return null;

    });

    return UserMock;
});

describe('UserUtil', () => {

    test('should check if fetchUsers returns data', async () => {
        // Given
        const testFetch = await fetchUsers();
        const result = testFetch.listUsers._results[0].content.length;
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
        const testFindByPk = await fetchUserByPk(2);
        console.log(testFindByPk);
        const result = testFindByPk.dataValues.userName;
        // Then
        expect(result).toBe('pk Found');
    });

    test('should return by emailAddress', async () => {
        // Given
        const testFindUserToAuth = await findUserToAuth('xyz@wzy.com');
        console.log(testFindUserToAuth);
        const result = testFindUserToAuth.dataValues.userName;
        // Then
        expect(result).toBe('Email Found');
    });


    test('should register user', async () => {
        // Given
        const testRegisterUser = await registerUser('newUser', 'popo@popo.pl', 'password');
        console.log(testRegisterUser);
        const result = testRegisterUser.result.userName;
        // Then
        expect(result).toBe('newUser');
    });
});
