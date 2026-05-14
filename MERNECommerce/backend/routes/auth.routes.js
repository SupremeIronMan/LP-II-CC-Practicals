const express = require('express');
const router = express.Router();

const verifyAdmin = require('../middleware/loginMiddleware');
const authController = require('../controllers/userController');

/* ============ AUTH ROUTES ============ */

// Register user (admin-only OR public — choose one)
router.post('/register', verifyAdmin, authController.createUser);

// Admin login
router.post('/login', authController.adminLogin);

module.exports = router;
