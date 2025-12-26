const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Jobs', // Matches your Jobs table
      key: 'id'
    }
  },
  doc_type: {
    type: DataTypes.STRING, 
    allowNull: false
    // e.g., 'Commercial Invoice'
  },
  original_name: {
    type: DataTypes.STRING,
    allowNull: false
    // e.g., 'Mohish_Invoice_V2.pdf' (What the user sees)
  },
  r2_key: {
    type: DataTypes.STRING,
    allowNull: false
    // e.g., 'jobs/1001/commercial_invoice.pdf' (What R2 sees)
  },
  mime_type: {
    type: DataTypes.STRING
  },
  size: {
    type: DataTypes.INTEGER // File size in bytes
  },
  uploaded_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Documents',
  timestamps: true
});

module.exports = Document;