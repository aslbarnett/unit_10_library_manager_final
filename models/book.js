'use strict';
module.exports = (sequelize, DataTypes) => {
    var book = sequelize.define('book', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        genre: DataTypes.STRING,
        first_published: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
    return book;
};