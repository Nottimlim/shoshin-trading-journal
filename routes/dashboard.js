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

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.session.user._id });
    
    // Calculate basic statistics
    const totalTrades = trades.length;
    const winningTrades = trades.filter(trade => trade.outcome === 'win').length;
    const losingTrades = trades.filter(trade => trade.outcome === 'loss').length;
    const openTrades = trades.filter(trade => trade.outcome === 'open').length;
    
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100).toFixed(2) : 0;
    
    const totalProfitLoss = trades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);
    
    // Get the most recent trades
    const recentTrades = trades.sort((a, b) => b.entryDate - a.entryDate).slice(0, 5);
    
    // Calculate most used strategies
    const strategies = {};
    trades.forEach(trade => {
      if (trade.strategy) {
        strategies[trade.strategy] = (strategies[trade.strategy] || 0) + 1;
      }
    });
    const topStrategies = Object.entries(strategies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([strategy, count]) => ({ strategy, count }));

    res.render('dashboard', {
      totalTrades,
      winningTrades,
      losingTrades,
      openTrades,
      winRate,
      totalProfitLoss,
      recentTrades,
      topStrategies
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).send('An error occurred while loading the dashboard');
  }
});

module.exports = router;
