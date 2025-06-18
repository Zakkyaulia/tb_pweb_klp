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
    jurusan: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
   // Tambahan field jurusan
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user', // cocokkan dengan migration
  });
  return User;
};
