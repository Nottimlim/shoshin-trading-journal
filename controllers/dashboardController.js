const Trade = require('../models/Trade');

exports.getDashboard = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.session.user.id }).sort({ entryDate: -1 }).limit(5);
    
    const totalTrades = await Trade.countDocuments({ user: req.session.user.id });
    const winningTrades = await Trade.countDocuments({ user: req.session.user.id, outcome: 'win' });
    const openTrades = await Trade.countDocuments({ user: req.session.user.id, exitDate: null });
    
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100).toFixed(2) : 0;
    
    const totalProfitLoss = trades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);

    res.render('dashboard', {
      totalTrades,
      winRate,
      totalProfitLoss,
      openTrades,
      recentTrades: trades
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).send('An error occurred while loading the dashboard');
  }
};
