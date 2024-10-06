const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  entryPrice: {
    type: Number,
    required: true
  },
  exitPrice: {
    type: Number
  },
  quantity: {
    type: Number,
    required: true
  },
  entryDate: {
    type: Date,
    required: true
  },
  exitDate: {
    type: Date
  },
  strategy: String,
  notes: String,
  outcome: {
    type: String,
    enum: ['win', 'loss', 'breakeven', 'open'],
    default: 'open'
  },
  profitLoss: Number,
  riskRewardRatio: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trade', TradeSchema);
