'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.request_surat, {
        foreignKey: 'user_id',
        as: 'requestSurats'
      });
    }
  }
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nama: DataTypes.STRING,
    nim: DataTypes.STRING,
    jurusan: DataTypes.STRING,
    email: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user'
    }
  }, {
    sequelize,
    modelName: 'users',
    tableName: 'users',
  });
  return User;
}; 