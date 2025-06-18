// src/models/user.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here jika perlu
    }
  }
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama: DataTypes.STRING,
    nim: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING, // Tambahkan ini
    password: DataTypes.STRING  // Tambahkan ini
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user', // penting agar cocok dengan nama tabel migrasi
  });
  return User;
};
