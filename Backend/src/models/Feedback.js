// backend/src/models/Feedback.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Feedback = sequelize.define('Feedback', {
    feedback_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    disaster_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'feedback',
    timestamps: true,
    createdAt: 'submitted_at',
    updatedAt: false,
});

module.exports = Feedback;