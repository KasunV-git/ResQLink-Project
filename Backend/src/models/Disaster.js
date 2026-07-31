// backend/src/models/Disaster.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Disaster = sequelize.define('Disaster', {
    disaster_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lat: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
    },
    lng: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'resolved', 'pending'),
        defaultValue: 'pending',
    },
    severity_score: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
    },
    predictor_risk_level: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        defaultValue: 'low',
    },
    reported_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    media_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    verification_status: {
        type: DataTypes.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'pending',
    },
}, {
    tableName: 'disasters',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Disaster;