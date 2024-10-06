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
    const trades = await Trade.find({ user: req.session.user._id }).sort({ entryDate: -1 });
    res.render('trades/index', { trades });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching trades');
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
      user: req.session.user._id
    });
    await trade.save();
    res.redirect('/trades');
  } catch (error) {
    console.error(error);
    res.render('trades/new', { error: 'Error creating trade', trade: req.body });
  }
});

// Show a specific trade
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.id, user: req.session.user._id });
    if (!trade) {
      return res.status(404).send('Trade not found');
    }
    res.render('trades/show', { trade });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the trade');
  }
});

// Form to edit a trade
router.get('/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.id, user: req.session.user._id });
    if (!trade) {
      return res.status(404).send('Trade not found');
    }
    res.render('trades/edit', { trade });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the trade');
  }
});

// Update a trade
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const trade = await Trade.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!trade) {
      return res.status(404).send('Trade not found');
    }
    res.redirect(`/trades/${trade._id}`);
  } catch (error) {
    console.error(error);
    res.render('trades/edit', { error: 'Error updating trade', trade: req.body });
  }
});

// Delete a trade
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const trade = await Trade.findOneAndDelete({ _id: req.params.id, user: req.session.user._id });
    if (!trade) {
      return res.status(404).send('Trade not found');
    }
    res.redirect('/trades');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while deleting the trade');
  }
});

module.exports = router;
