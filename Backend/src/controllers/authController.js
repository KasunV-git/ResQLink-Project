// backend/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Register new user
const register = async (req, res) => {
    try {
        const { name, email, password, phone_number, role } = req.body;

        // Check existing email
        const existing = await User.findOne({ where: { email } });
        if (existing) return errorResponse(res, 'Email already registered.', 400);

        // Hash password
        const password_hash = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name,
            email,
            password_hash,
            phone_number: phone_number || null,
            role: role || 'user',
        });

        const token = generateToken({
            id: user.user_id,
            email: user.email,
            role: user.role,
        });

        return successResponse(res, 'Registration successful.', {
            token,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                trust_score: user.trust_score,
                verified: user.verified,
            },
        }, 201);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return errorResponse(res, 'Invalid email or password.', 401);

        if (user.account_status !== 'active')
            return errorResponse(res, 'Account is suspended or inactive.', 403);

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return errorResponse(res, 'Invalid email or password.', 401);

        const token = generateToken({
            id: user.user_id,
            email: user.email,
            role: user.role,
        });

        return successResponse(res, 'Login successful.', {
            token,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                trust_score: user.trust_score,
                verified: user.verified,
                primary_region: user.primary_region,
                phone_number: user.phone_number,
                created_at: user.created_at,
            },
        });
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Get logged-in user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password_hash'] },
        });
        if (!user) return errorResponse(res, 'User not found.', 404);
        return successResponse(res, 'Profile fetched.', user);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Update profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone_number, primary_region } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) return errorResponse(res, 'User not found.', 404);

        await user.update({ name, phone_number, primary_region });
        return successResponse(res, 'Profile updated.', {
            name: user.name,
            phone_number: user.phone_number,
            primary_region: user.primary_region,
        });
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Upload avatar
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) return errorResponse(res, 'No file uploaded.', 400);
        const user = await User.findByPk(req.user.id);
        const avatarUrl = `/uploads/profile-images/${req.file.filename}`;
        await user.update({ avatar: avatarUrl });
        return successResponse(res, 'Avatar updated.', { avatar: avatarUrl });
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Logout
const logout = async (req, res) => {
    return successResponse(res, 'Logged out successfully.');
};

module.exports = { register, login, getProfile, updateProfile, uploadAvatar, logout };