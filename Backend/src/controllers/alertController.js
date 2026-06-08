// backend/src/controllers/alertController.js
const { Alert, AlertDelivery } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Get all alerts for citizen
const getAlerts = async (req, res) => {
    try {
        const { limit = 20 } = req.query;

        const alerts = await Alert.findAll({
            where: { target_role: ['user', 'all'] },
            order: [['sent_at', 'DESC']],
            limit: parseInt(limit),
        });

        // Get acknowledged alerts for this user
        const deliveries = await AlertDelivery.findAll({
            where: { user_id: req.user.id },
        });

        const ackedIds = new Set(
            deliveries
                .filter(d => d.acknowledged)
                .map(d => d.alert_id)
        );

        // Attach acknowledged status to each alert
        const result = alerts.map(a => ({
            ...a.toJSON(),
            acknowledged: ackedIds.has(a.alert_id),
        }));

        return successResponse(res, 'Alerts fetched.', result);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Get single alert
const getAlertById = async (req, res) => {
    try {
        const alert = await Alert.findByPk(req.params.id);
        if (!alert) return errorResponse(res, 'Alert not found.', 404);
        return successResponse(res, 'Alert fetched.', alert);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Acknowledge an alert
const acknowledgeAlert = async (req, res) => {
    try {
        const { id } = req.params;

        const [delivery] = await AlertDelivery.findOrCreate({
            where: { alert_id: id, user_id: req.user.id },
            defaults: { delivery_status: 'delivered' },
        });

        await delivery.update({
            acknowledged: true,
            acknowledged_time: new Date(),
        });

        return successResponse(res, 'Alert acknowledged.');
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

module.exports = { getAlerts, getAlertById, acknowledgeAlert };