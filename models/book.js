'use strict';
module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'Title is required'
                }
            }
        },
        author: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'Author is required'
                }
            }
        },
        genre: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'Genre is required'
                }
            }
        },
        first_published: DataTypes.INTEGER
    });

    // Class Method
    Book.associate = function(models) {
        Book.hasMany(models.Loan, { foreignKey: "book_id" });
    };

    return Book;
};