const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('Exporter', 'Consignee', 'Both'),
    defaultValue: 'Both'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  // 👇 CRITICAL FIX: Match the exact Capital 'C' name from your screenshot
  tableName: 'Companies', 
  timestamps: true // Keeps createdAt and updatedAt working
});

module.exports = Company;