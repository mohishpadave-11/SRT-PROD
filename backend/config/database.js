const { Sequelize } = require('sequelize');
require('dotenv').config();

// This connects to Supabase
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Keeps your terminal clean
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Needed for Supabase connection
    }
  }
});

module.exports = sequelize;