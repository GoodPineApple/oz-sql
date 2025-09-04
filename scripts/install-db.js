
// Load environment variables first
require('dotenv').config();

// Import sequelize instance
var sequelize = require('../util/db');

// Import models for database table creation
var Users = require('../models/users');
var Memos = require('../models/memos');
var DesignTemplates = require('../models/designTemplates');

// Create database tables
async function createTables() {
  try {
    console.log('Creating database tables...');
    
    // Disable foreign key checks to avoid constraint issues
    console.log('Disabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Drop all tables
    console.log('Dropping existing tables...');
    await Memos.sync({ force: true });
    console.log('Memos table dropped/recreated');
    
    await DesignTemplates.sync({ force: true });
    console.log('DesignTemplates table dropped/recreated');
    
    await Users.sync({ force: true });
    console.log('Users table dropped/recreated');
    
    // Re-enable foreign key checks
    console.log('Re-enabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('All database tables created successfully!');
    process.exit(0); // Exit after completion
  } catch (error) {
    console.log(error.message);
    console.error('Error creating database tables:', error);
    process.exit(1); // Exit with error code
  }
}

// Initialize database tables
createTables();