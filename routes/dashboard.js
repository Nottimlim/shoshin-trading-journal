const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

router.get('/', isAuthenticated, dashboardController.getDashboard);

module.exports = router;
