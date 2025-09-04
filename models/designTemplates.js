const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');

const DesignTemplates = sequelize.define('designTemplate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  backgroundColor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  textColor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  borderStyle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shadowStyle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preview: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// console.log("syncing designTemplates  ");
// DesignTemplates.sync({ force: true });

module.exports = DesignTemplates;
