const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('memo', 'root', 'qwer1234', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;