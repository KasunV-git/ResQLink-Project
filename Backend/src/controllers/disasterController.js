// backend/src/controllers/disasterController.js
const { Disaster } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { Op } = require('sequelize');

// Submit disaster report
const submitReport = async (req, res) => {
    try {
        const { type, location, description, lat, lng } = req.body;
        const media_url = req.file
            ? `/uploads/reports/${req.file.filename}`
            : null;

        const disaster = await Disaster.create({
            type,
            location,
            description,
            lat: lat || null,
            lng: lng || null,
            media_url,
            reported_by: req.user.id,
            status: 'pending',
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

module.exports = {
    submitReport,
    getMyReports,
    getReportById,
    getDisasters,
    getNearbyHazards,
};