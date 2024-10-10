const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

// Apply isAuthenticated middleware to all trade routes
router.use(isAuthenticated);

// List all trades
router.get('/', tradeController.getAllTrades);

// Form to create a new trade
router.get('/new', tradeController.getNewTradeForm);

// Create a new trade
router.post('/', tradeController.createTrade);

// Show a single trade
router.get('/:id', tradeController.getTradeDetails);

// Form to edit a trade
router.get('/:id/edit', tradeController.getEditTradeForm);

// Update a trade
router.put('/:id', tradeController.updateTrade);

// Delete a trade
router.delete('/:id', tradeController.deleteTrade);

module.exports = router;