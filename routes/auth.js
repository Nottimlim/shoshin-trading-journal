const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.get('/login', authController.getLoginPage);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/signup', authController.getSignupPage);
router.post('/signup', authController.signup);

module.exports = router;
