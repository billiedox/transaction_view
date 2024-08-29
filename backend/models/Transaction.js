// models/Transaction.js
const mongoose = require('mongoose');

// MongoDB Transaction Schema and Model
const transactionSchema = new mongoose.Schema({
  id: String,
  type: String,
  address: String,
  chain: String,
  spentAddress: String,
  receivedAddress: String,
  spentAmount: Number,
  spentCurrency: String,
  receivedAmount: Number,
  receivedCurrency: String,
  receivedIcon: String,
  spentIcon: String,
  timestamp: Number,
});

module.exports = mongoose.model('Transaction', transactionSchema);