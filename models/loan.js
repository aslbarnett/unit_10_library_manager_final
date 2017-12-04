'use strict';
module.exports = (sequelize, DataTypes) => {
    const Loan = sequelize.define('Loan', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        book_id: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: 'Book selection required'
                }
            }
        },
        patron_id: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: 'Patron name required'
                }
            }
        },
        loaned_on: {
            type: DataTypes.DATEONLY,
            validate: {
                notEmpty: {
                    msg: 'Loaned on date required'
                },
                isDate: {
                    msg: 'Please enter a date in the following format: YYYY-MM-DD'
                }
            }
        },
        return_by: {
            type: DataTypes.DATEONLY,
            validate: {
                notEmpty: {
                    msg: 'Return by date required'
                },
                isDate: {
                    msg: 'Please enter a date in the following format: YYYY-MM-DD'
                }
            }
        },
        returned_on: DataTypes.DATEONLY
    });

    // Class method
    Loan.associate = function(models) {
        Loan.belongsTo(models.Book, { foreignKey: "book_id" });
        Loan.belongsTo(models.Patron, { foreignKey: "patron_id" });
    };

    return Loan;
};