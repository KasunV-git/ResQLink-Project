// backend/src/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'volunteer', 'user'),
        defaultValue: 'user',
    },
    account_status: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active',
    },
    primary_region: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    trust_score: {
        type: DataTypes.INTEGER,
        defaultValue: 50,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = User;