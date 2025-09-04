const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');

const Users = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// console.log("syncing users  ");
// Users.sync({ force: true });

module.exports = Users;