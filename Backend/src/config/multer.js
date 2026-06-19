// backend/src/config/multer.js
const multer = require('multer');
const path = require('path');

// Storage for disaster report images
const reportStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'src/uploads/reports/'),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});

// Storage for profile avatars
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'src/uploads/profile-images/'),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});

// Only allow image files
const imageFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|heic|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed.'));
};

const uploadReport = multer({
    storage: reportStorage,
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const uploadAvatar = multer({
    storage: avatarStorage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = { uploadReport, uploadAvatar };