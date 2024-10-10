const Trade = require('../models/Trade');

exports.getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.session.user.id }).sort({ entryDate: -1 });
    res.render('trades/index', { trades });
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).render('error', { error: 'Error fetching trades' });
  }
};

exports.getNewTradeForm = (req, res) => {
  res.render('trades/new');
};

exports.createTrade = async (req, res) => {
  try {
    const { entryPrice, exitPrice, profitLoss: inputProfitLoss, tradeType, entryDate, exitDate, ...otherFields } = req.body;
    
    const newTrade = new Trade({
      ...otherFields,
      user: req.session.user.id,
      entryPrice: parseFloat(entryPrice),
      exitPrice: exitPrice ? parseFloat(exitPrice) : undefined,
      profitLoss: inputProfitLoss ? parseFloat(inputProfitLoss) : undefined,
      tradeType,
      entryDate,
      exitDate: exitDate || undefined
    });

    await newTrade.save();
    res.redirect('/trades');
  } catch (error) {
    console.error('Error creating trade:', error);
    res.render('trades/new', { error: 'Error creating trade: ' + error.message });
  }
};

exports.getTradeDetails = async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.id, user: req.session.user.id });
    if (!trade) {
      return res.status(404).render('error', { error: 'Trade not found' });
    }
    res.render('trades/show', { trade });
  } catch (error) {
    console.error('Error fetching trade details:', error);
    res.status(500).render('error', { error: 'Error fetching trade details' });
  }
};

exports.getEditTradeForm = async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.id, user: req.session.user.id });
    if (!trade) {
      return res.status(404).render('error', { error: 'Trade not found' });
    }
    
    const formattedTrade = {
      ...trade.toObject(),
      entryDate: trade.entryDate ? trade.entryDate.toISOString().split('T')[0] : '',
      exitDate: trade.exitDate ? trade.exitDate.toISOString().split('T')[0] : '',
      profitLoss: trade.profitLoss !== undefined ? trade.profitLoss : ''
    };
    
    res.render('trades/edit', { trade: formattedTrade });
  } catch (error) {
    console.error('Error fetching trade for edit:', error);
    res.status(500).render('error', { error: 'Error fetching trade for edit' });
  }
};

exports.updateTrade = async (req, res) => {
  try {
    const { entryPrice, exitPrice, profitLoss, tradeType, entryDate, exitDate, ...otherFields } = req.body;
    
    const updatedTrade = await Trade.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      {
        ...otherFields,
        entryPrice: parseFloat(entryPrice),
        exitPrice: exitPrice ? parseFloat(exitPrice) : undefined,
        profitLoss: profitLoss ? parseFloat(profitLoss) : undefined,
        tradeType,
        entryDate,
        exitDate: exitDate || undefined
      },
      { new: true, runValidators: true }
    );

    if (!updatedTrade) {
      return res.status(404).render('error', { error: 'Trade not found' });
    }

    res.redirect(`/trades/${updatedTrade._id}`);
  } catch (error) {
    console.error('Error updating trade:', error);
    const trade = await Trade.findById(req.params.id);
    res.status(400).render('trades/edit', { trade, error: 'Error updating trade: ' + error.message });
  }
};

exports.deleteTrade = async (req, res) => {
  try {
    const deletedTrade = await Trade.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
    if (!deletedTrade) {
      return res.status(404).render('error', { error: 'Trade not found' });
    }
    res.redirect('/trades');
  } catch (error) {
    console.error('Error deleting trade:', error);
    res.status(500).render('error', { error: 'Error deleting trade' });
  }
};