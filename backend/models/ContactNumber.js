const mongoose = require('mongoose');

const contactNumberSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactNumber', contactNumberSchema);
