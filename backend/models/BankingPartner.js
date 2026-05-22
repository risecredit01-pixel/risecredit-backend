const mongoose = require('mongoose');

const bankingPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true, trim: true },
  bullets: [{ type: String, trim: true }],
  logoUrl: { type: String, trim: true, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BankingPartner', bankingPartnerSchema);
