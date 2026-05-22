const mongoose = require('mongoose');

const emailIdSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailId', emailIdSchema);
