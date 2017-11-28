'use strict';
module.exports = (sequelize, DataTypes) => {
    var loan = sequelize.define('loan', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        book_id: DataTypes.INTEGER,
        patron_id: DataTypes.INTEGER,
        loaned_on: DataTypes.DATE,
        return_by: DataTypes.DATE,
        returned_on: DataTypes.DATE
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
    return loan;
};