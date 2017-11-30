'use strict';
module.exports = (sequelize, DataTypes) => {
    const Patron = sequelize.define('Patron', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        address: DataTypes.STRING,
        email: DataTypes.STRING,
        library_id: DataTypes.STRING,
        zip_code: DataTypes.INTEGER
    });

    // Class Method
    Patron.associate = function(models) {
        Patron.hasMany(models.Loan, { foreignKey: "patron_id" });
    };

    return Patron;
};