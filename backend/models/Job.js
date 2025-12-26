const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // ============================
  // --- 1. NEW FIELDS (PARTIES) ---
  // ============================
  // We store the name as a STRING (Snapshot of what was selected)
  // The "List of Options" will come from a different table later.
  job_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  exporter_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  exporter_address: {
    type: DataTypes.TEXT, // Address can be long, so we use TEXT
    allowNull: true
  },
  consignee_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  consignee_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notify_party: {
    type: DataTypes.STRING,
    allowNull: true
  },
  final_destination: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // ============================
  // --- 2. EXISTING FIELDS ---
  // ============================
  port_of_loading: {
    type: DataTypes.STRING,
    allowNull: false
  },
  port_of_discharge: {
    type: DataTypes.STRING,
    allowNull: false
  },
  service_type: { 
    type: DataTypes.ENUM('Import', 'Export'),
    allowNull: false
  },
  shipment_type: { 
    type: DataTypes.ENUM('LCL', 'FCL', 'Part of FCL'),
    allowNull: false
  },
  transport_mode: { 
    type: DataTypes.ENUM('Sea', 'Air'),
    allowNull: false
  },
  
  // --- Numeric & Specific Fields ---
  volume: {
    type: DataTypes.FLOAT, 
    allowNull: true
  },
  container_no: {
    type: DataTypes.STRING, 
    allowNull: true
  },
  
  // --- Dates ---
  eta: { type: DataTypes.DATEONLY, allowNull: true },
  delivered_date: { type: DataTypes.DATEONLY, allowNull: true },
  sob_date: { type: DataTypes.DATEONLY, allowNull: true },
  bl_date: { type: DataTypes.DATEONLY, allowNull: true },
  bill_of_entry_date: { type: DataTypes.DATEONLY, allowNull: true },
  invoice_date: { type: DataTypes.DATEONLY, allowNull: true },

  // --- Identification Numbers ---
  invoice_no: { type: DataTypes.STRING, allowNull: true },
  bill_of_entry_no: { type: DataTypes.STRING, allowNull: true },
  bl_no: { type: DataTypes.STRING, allowNull: true },
  shipping_bill_no: { type: DataTypes.STRING, allowNull: true },

  // --- Vessel / Flight Info ---
  vessel_flight_type: {
    type: DataTypes.ENUM('Vessel No', 'Flight No'),
    allowNull: true
  },
  vessel_flight_name: { 
    type: DataTypes.STRING,
    allowNull: true
  },

  // --- System Fields ---
  job_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('Draft', 'In Progress', 'Completed', 'Cancelled'),
    defaultValue: 'Draft'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Job;