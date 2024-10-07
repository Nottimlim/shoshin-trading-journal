const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

// List all trades
router.get('/', isAuthenticated, tradeController.getAllTrades);

// Form to create a new trade
router.get('/new', isAuthenticated, tradeController.getNewTradeForm);

// Create a new trade
router.post('/', isAuthenticated, tradeController.createTrade);

// Show a single trade
router.get('/:id', isAuthenticated, tradeController.getTradeDetails);

// Form to edit a trade
router.get('/:id/edit', isAuthenticated, tradeController.getEditTradeForm);

// Update a trade
router.put('/:id', isAuthenticated, tradeController.updateTrade);

// Delete a trade
router.delete('/:id', isAuthenticated, tradeController.deleteTrade);

module.exports = router;

