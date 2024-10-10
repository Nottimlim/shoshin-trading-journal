const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController.js');

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

// Apply isAuthenticated middleware to all dashboard routes
router.use(isAuthenticated);

router.get('/', async (req, res, next) => {
  try {
    await dashboardController.getDashboard(req, res);
  } catch (error) {
    console.error('Error in dashboard route:', error);
    next(error);
  }
});

module.exports = router;