const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

// List all trades
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.session.user.id }).sort({ entryDate: -1 });
    res.render('trades/index', { trades });
  } catch (error) {
    res.status(500).render('error', { error: 'Error fetching trades' });
  }
});

// Form to create a new trade
router.get('/new', isAuthenticated, (req, res) => {
  res.render('trades/new');
});

// Create a new trade
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const trade = new Trade({
      ...req.body,
      user: req.session.user.id
    });
    await trade.save();
    res.redirect('/trades');
  } catch (error) {
    res.render('trades/new', { error: 'Error creating trade' });
  }
});

// Show a single trade
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.id, user: req.session.user.id });
    if (!trade) {
      return res.status(404).render('error', { error: 'Trade not found' });
    }
    res.render('trades/show', { trade });
  } catch (error) {
    res.status(500).render('error', { error: 'Error fetching trade' });
  }
});

// Form to edit a trade
router.get('/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.id, user: req.session.user.id });
    if (!trade) {
      return res.status(404).render('error', { error: 'Trade not found' });
    }
    res.render('trades/edit', { trade });
  } catch (error) {
    res.status(500).render('error', { error: 'Error fetching trade' });
  }
});

// Update a trade
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const trade = await Trade.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!trade) {
      return res.status(404).render('error', { error: 'Trade not found' });
    }
    res.redirect(`/trades/${trade._id}`);
  } catch (error) {
    res.render('trades/edit', { trade: req.body, error: 'Error updating trade' });
  }
});

// Delete a trade
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const trade = await Trade.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
    if (!trade) {
      return res.status(404).render('error', { error: 'Trade not found' });
    }
    res.redirect('/trades');
  } catch (error) {
    res.status(500).render('error', { error: 'Error deleting trade' });
  }
});

module.exports = router;
