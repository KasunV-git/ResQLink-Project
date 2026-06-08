// backend/src/models/Alert.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Alert = sequelize.define('Alert', {
    alert_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    disaster_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    severity: {
        type: DataTypes.ENUM('CRITICAL', 'HIGH', 'MODERATE', 'LOW', 'UPDATE'),
        defaultValue: 'LOW',
    },
    channel: {
        type: DataTypes.ENUM('email', 'sms', 'app'),
        defaultValue: 'app',
    },
    target_role: {
        type: DataTypes.ENUM('admin', 'volunteer', 'user', 'all'),
        defaultValue: 'all',
    },
    sent_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'alerts',
    timestamps: false,
});

module.exports = Alert;