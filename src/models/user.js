'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
<<<<<<< HEAD
      // define association here jika perlu
=======
      User.hasMany(models.request_surat, {
        foreignKey: 'user_id',
        as: 'requests'
      });
>>>>>>> loly
    }
  }
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
<<<<<<< HEAD
      autoIncrement: true,
=======
      autoIncrement: true
>>>>>>> loly
    },
    nama: DataTypes.STRING,
    nim: DataTypes.STRING,
    jurusan: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
<<<<<<< HEAD
    password: DataTypes.STRING,
   // Tambahan field jurusan
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user', // cocokkan dengan migration
=======
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user'
>>>>>>> loly
  });
  return User;
};
