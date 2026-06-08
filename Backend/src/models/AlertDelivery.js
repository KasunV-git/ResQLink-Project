// backend/src/models/AlertDelivery.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AlertDelivery = sequelize.define('AlertDelivery', {
    delivery_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    alert_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    acknowledged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    acknowledged_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    delivery_status: {
        type: DataTypes.ENUM('pending', 'delivered', 'failed'),
        defaultValue: 'delivered',
    },
}, {
    tableName: 'alert_deliveries',
    timestamps: false,
});

module.exports = AlertDelivery;