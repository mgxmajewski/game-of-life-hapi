'use strict';

const { Model, DataTypes } = require('sequelize');
const Bcrypt = require('bcrypt');

module.exports = (sequelize) => {

    class User extends Model {}

    User.init({
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A name is required'
                },
                notEmpty: {
                    msg: 'Please provide name'
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Email already exists'
            },
            validate: {
                notNull: {
                    msg: 'A email is required'
                },
                isEmail: {
                    msg: 'Please provide email'
                }
            }
        },
        password: {
            type: DataTypes.STRING, // set a virtual field
            allowNull: false,
            timestamps: false,
            hooks: {
                beforeCreate: (user, options) => {

                    {
                        user.password = user.password && user.password !== '' ? Bcrypt.hashSync(user.password, 10) : '';
                        console.log('Before Creating The User');
                    }
                }
            },
            validate: {
                notNull: {
                    msg: 'A password is required'
                },
                notEmpty: {
                    msg: 'Please provide password'
                },
                len: {
                    args: [8, 20],
                    msg: 'Must be in range of 8-20 characters'
                }
            }
        }
    },{ sequelize });

    return User;
};
