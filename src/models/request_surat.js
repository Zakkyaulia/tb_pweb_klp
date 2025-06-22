'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RequestSurat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RequestSurat.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  RequestSurat.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: DataTypes.INTEGER,
    jenis_surat: DataTypes.STRING,
    tanggal_request: DataTypes.DATE,
    status: DataTypes.STRING,
    file_pengantar: DataTypes.STRING,
    komentar_admin: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'RequestSurat',
    tableName: 'request_surats',
    timestamps: true
  });
  return RequestSurat;
};