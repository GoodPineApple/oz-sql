const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE_NAME, process.env.DB_USER_NAME, process.env.DB_USER_PW, {
  host: process.env.DB_HOST_URI,
  dialect: process.env.DB_DIALECT
});

module.exports = sequelize;