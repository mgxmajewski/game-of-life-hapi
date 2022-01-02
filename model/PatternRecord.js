'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    class PatternRecord extends Model {}

    PatternRecord.init( {
        creator: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
            validate: {
                notNull: {
                    msg: 'A creator id is required'
                }
            }
        },
        snapshot_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A snapshot name is required'
                },
                notEmpty: {
                    msg: 'Please provide snapshot name'
                }
            }
        },
        pattern: {
            type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING)),
            allowNull: false,
            unique: false,
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

    // Pattern_Records.associate = (models) => {
    //
    //     Pattern_Records.belongsTo(models.User, { foreignKey: 'creator' });
    // };

    return PatternRecord;
};
