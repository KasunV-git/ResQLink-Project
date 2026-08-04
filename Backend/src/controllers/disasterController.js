// backend/src/controllers/disasterController.js
const { Disaster, User } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { Op } = require('sequelize');
const db = require('../config/db');

// Submit disaster report
const submitReport = async (req, res) => {
    try {
        const { type, location, description, lat, lng, landmark, peopleAffected, severity } = req.body;
        const media_url = req.files && req.files.length > 0
            ? req.files.map(f => `/uploads/reports/${f.filename}`).join(',')
            : null;

        const disaster = await Disaster.create({
            type,
            location,
            landmark: landmark || null,
            people_affected: peopleAffected || null,
            description,
            lat: lat || null,
            lng: lng || null,
            media_url,
            reported_by: req.user.id,
            status: 'pending',
            predictor_risk_level: severity ? (severity.toLowerCase() === 'moderate' ? 'medium' : severity.toLowerCase()) : 'low',
        });

        return successResponse(res, 'Report submitted successfully.', disaster, 201);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Get reports by logged-in citizen
const getMyReports = async (req, res) => {
    try {
        const reports = await Disaster.findAll({
            where: { reported_by: req.user.id },
            order: [['created_at', 'DESC']],
        });
        return successResponse(res, 'Reports fetched.', reports);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Get single report
const getReportById = async (req, res) => {
    try {
        const report = await Disaster.findByPk(req.params.id);
        if (!report) return errorResponse(res, 'Report not found.', 404);
        return successResponse(res, 'Report fetched.', report);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Get all active disasters for map
const getDisasters = async (req, res) => {
    try {
        const disasters = await Disaster.findAll({
            where: { status: ['active', 'pending'] },
            order: [['created_at', 'DESC']],
        });
        return successResponse(res, 'Disasters fetched.', disasters);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Get nearby hazards by coordinates
const getNearbyHazards = async (req, res) => {
    try {
        const { lat, lng, radius = 20 } = req.query;
        const latDelta = radius / 111;
        const lngDelta = radius / (111 * Math.cos((lat * Math.PI) / 180));

        const hazards = await Disaster.findAll({
            where: {
                lat: { [Op.between]: [parseFloat(lat) - latDelta, parseFloat(lat) + latDelta] },
                lng: { [Op.between]: [parseFloat(lng) - lngDelta, parseFloat(lng) + lngDelta] },
                status: ['active', 'pending'],
            },
        });
        return successResponse(res, 'Nearby hazards fetched.', hazards);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Admin: Get all reports
const getAllReports = async (req, res) => {
    try {
        const reports = await Disaster.findAll({
            include: [{ model: User, as: 'reporter', attributes: ['name', 'role'] }],
            order: [['created_at', 'DESC']],
        });
        return successResponse(res, 'All reports fetched.', reports);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Admin: Update report status
const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, announce, message, priority } = req.body;
        
        const report = await Disaster.findByPk(id);
        if (!report) return errorResponse(res, 'Report not found.', 404);

        if (action === 'approve') {
            await report.update({
                verification_status: 'verified',
                status: 'active'
            });

            // Announce if requested
            if (announce) {
                const timeString = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                await db.query(
                    `INSERT INTO alerts (priority, message, source, time, target) VALUES (?, ?, ?, ?, ?)`,
                    [priority || 'High', message || `Disaster verified: ${report.type} at ${report.location}`, 'Admin System', timeString, 'For Volunteers']
                );
            }

            return successResponse(res, 'Report approved successfully.', report);
        } else if (action === 'reject') {
            await report.update({
                verification_status: 'rejected',
                status: 'resolved'
            });
            
            return successResponse(res, 'Report rejected successfully.', report);
        } else {
            return errorResponse(res, 'Invalid action.', 400);
        }
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

module.exports = {
    submitReport,
    getMyReports,
    getReportById,
    getDisasters,
    getNearbyHazards,
    getAllReports,
    updateReportStatus,
};