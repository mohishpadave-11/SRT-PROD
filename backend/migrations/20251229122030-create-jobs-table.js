'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Jobs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      job_date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.literal('CURRENT_DATE')
      },
      exporter_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      exporter_address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      consignee_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      consignee_address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      notify_party: {
        type: Sequelize.STRING,
        allowNull: true
      },
      final_destination: {
        type: Sequelize.STRING,
        allowNull: true
      },
      port_of_loading: {
        type: Sequelize.STRING,
        allowNull: false
      },
      port_of_discharge: {
        type: Sequelize.STRING,
        allowNull: false
      },
      service_type: {
        type: Sequelize.ENUM('Import', 'Export'),
        allowNull: false
      },
      shipment_type: {
        type: Sequelize.ENUM('LCL', 'FCL', 'Part of FCL'),
        allowNull: false
      },
      transport_mode: {
        type: Sequelize.ENUM('Sea', 'Air'),
        allowNull: false
      },
      volume: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      container_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      eta: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      delivered_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      sob_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      bl_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      bill_of_entry_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      invoice_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      invoice_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bill_of_entry_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bl_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      shipping_bill_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vessel_flight_type: {
        type: Sequelize.ENUM('Vessel No', 'Flight No'),
        allowNull: true
      },
      vessel_flight_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      job_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      status: {
        type: Sequelize.ENUM('Draft', 'In Progress', 'Completed', 'Cancelled'),
        defaultValue: 'Draft'
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Jobs');
  }
};
