'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Surat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Surat.init({
    surat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    jenis_surat: DataTypes.STRING,
    template_file: DataTypes.STRING,
    preview_file: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Surat',
    tableName: 'surat',
    timestamps: true
  });
  return Surat;
};