'use strict';
const {
  Model
} = require('sequelize');

// Model untuk tabel user
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Relasi ke request_surat
    static associate(models) {
      User.hasMany(models.request_surat, {
        foreignKey: 'user_id',
        as: 'requests'
      });
    }
  }
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: DataTypes.STRING,
    nim: DataTypes.STRING,
    jurusan: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user'
  });
  return User;
};