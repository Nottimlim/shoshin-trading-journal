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
    type: Number
  },
  outcome: {
    type: String,
    enum: ['win', 'loss', 'breakeven', 'open'],
    default: 'open'
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
  if (this.profitLoss !== undefined) {
    if (this.profitLoss > 0) {
      this.outcome = 'win';
    } else if (this.profitLoss < 0) {
      this.outcome = 'loss';
    } else {
      this.outcome = 'breakeven';
    }
  }
  next();
});

// Virtual property to get formatted profitLoss (optional)
TradeSchema.virtual('formattedProfitLoss').get(function() {
  if (this.profitLoss !== undefined) {
    return this.profitLoss.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }
  return 'N/A';
});

module.exports = mongoose.model('Trade', TradeSchema);