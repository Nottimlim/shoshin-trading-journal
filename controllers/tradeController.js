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
  console.log('Request body:', req.body);
  console.log('User ID:', req.session.user.id);
  try {
    const { entryPrice, exitPrice, profitLoss: inputProfitLoss, ...otherFields } = req.body;
    
    let profitLoss, outcome;

    if (inputProfitLoss !== undefined && inputProfitLoss !== '') {
      profitLoss = parseFloat(inputProfitLoss);
    } else if (exitPrice) {
      profitLoss = parseFloat(exitPrice) - parseFloat(entryPrice);
    } else {
      profitLoss = 0;
    }

    if (!exitPrice) {
      outcome = 'open';
    } else if (profitLoss > 0) {
      outcome = 'win';
    } else if (profitLoss < 0) {
      outcome = 'loss';
    } else {
      outcome = 'breakeven';
    }

    const trade = new Trade({
      ...otherFields,
      entryPrice: parseFloat(entryPrice),
      exitPrice: exitPrice ? parseFloat(exitPrice) : undefined,
      profitLoss,
      outcome,
      user: req.session.user.id
    });

    console.log('New trade object:', trade);
    await trade.save();
    res.redirect('/trades');
  } catch (error) {
    console.error('Error creating trade:', error);
    res.render('trades/new', { error: 'Error creating trade' });
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
    res.render('trades/edit', { trade });
  } catch (error) {
    console.error('Error fetching trade for edit:', error);
    res.status(500).render('error', { error: 'Error fetching trade for edit' });
  }
};

exports.updateTrade = async (req, res) => {
  try {
    const { entryPrice, exitPrice, profitLoss: inputProfitLoss, ...otherFields } = req.body;
    
    let profitLoss, outcome;

    if (inputProfitLoss !== undefined && inputProfitLoss !== '') {
      profitLoss = parseFloat(inputProfitLoss);
    } else if (exitPrice) {
      profitLoss = parseFloat(exitPrice) - parseFloat(entryPrice);
    } else {
      profitLoss = 0;
    }

    if (!exitPrice) {
      outcome = 'open';
    } else if (profitLoss > 0) {
      outcome = 'win';
    } else if (profitLoss < 0) {
      outcome = 'loss';
    } else {
      outcome = 'breakeven';
    }

    const updatedTrade = await Trade.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      {
        ...otherFields,
        entryPrice: parseFloat(entryPrice),
        exitPrice: exitPrice ? parseFloat(exitPrice) : undefined,
        profitLoss,
        outcome
      },
      { new: true, runValidators: true }
    );

    if (!updatedTrade) {
      return res.status(404).render('error', { error: 'Trade not found' });
    }

    res.redirect(`/trades/${updatedTrade._id}`);
  } catch (error) {
    console.error('Error updating trade:', error);
    res.status(400).render('trades/edit', { trade: req.body, error: 'Error updating trade' });
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
