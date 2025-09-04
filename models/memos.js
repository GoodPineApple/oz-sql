const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');

const Memos = sequelize.define('memo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
  }
});

// Define associations
const Users = require('./users');
const DesignTemplates = require('./designTemplates');

// Memo belongs to User
Memos.belongsTo(Users, { foreignKey: 'userId', as: 'user' });
// Memo belongs to DesignTemplate
Memos.belongsTo(DesignTemplates, { foreignKey: 'templateId', as: 'template' });

// User has many Memos
Users.hasMany(Memos, { foreignKey: 'userId', as: 'memos' });
// DesignTemplate has many Memos
DesignTemplates.hasMany(Memos, { foreignKey: 'templateId', as: 'memos' });

// console.log("syncing memos  ");
// Memos.sync({ force: true });

module.exports = Memos;
