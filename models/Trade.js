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
  entryDate: {
    type: Date,
    required: true
  },
  exitDate: {
    type: Date
  },
  profitLoss: {
    type: Number,
    default: undefined
  },
  outcome: {
    type: String,
    enum: ['win', 'loss', 'breakeven', 'open'],
    required: true
  },
  tradeType: {
    type: String,
    enum: ['long', 'short'],
    required: true
  },
  riskRewardRatio: {
    type: String,
    required: true
  },
  notes: String
}, {
  timestamps: true
});

// Pre-save hook to automatically set the outcome based on profitLoss
TradeSchema.pre('save', function(next) {
  if (this.profitLoss > 0) {
    this.outcome = 'win';
  } else if (this.profitLoss < 0) {
    this.outcome = 'loss';
  } else {
    this.outcome = 'breakeven';
  }
  next();
});

// Virtual property to get formatted profitLoss (optional)
TradeSchema.virtual('formattedProfitLoss').get(function() {
  return this.profitLoss.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
});

module.exports = mongoose.model('Trade', TradeSchema);
