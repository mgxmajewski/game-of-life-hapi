'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    class Pattern extends Model {}

    Pattern.init( {
        patternName: {
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
        pattern: {
            type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING)),
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'A pattern is required'
                }
            }
        }

    }, {
        sequelize,
        timestamps: true
    });

    return Pattern;
};
