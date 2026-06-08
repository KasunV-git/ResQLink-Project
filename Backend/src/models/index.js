// backend/src/models/index.js
const User = require('./User');
const Disaster = require('./Disaster');
const Alert = require('./Alert');
const AlertDelivery = require('./AlertDelivery');
const Feedback = require('./Feedback');

// User → Disasters
User.hasMany(Disaster, { foreignKey: 'reported_by', as: 'reports' });
Disaster.belongsTo(User, { foreignKey: 'reported_by', as: 'reporter' });

// Alert → AlertDelivery
Alert.hasMany(AlertDelivery, { foreignKey: 'alert_id', as: 'deliveries' });
AlertDelivery.belongsTo(Alert, { foreignKey: 'alert_id', as: 'alert' });

// User → AlertDelivery
User.hasMany(AlertDelivery, { foreignKey: 'user_id', as: 'alertDeliveries' });
AlertDelivery.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User → Feedback
User.hasMany(Feedback, { foreignKey: 'user_id', as: 'feedbacks' });
Feedback.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = { User, Disaster, Alert, AlertDelivery, Feedback };