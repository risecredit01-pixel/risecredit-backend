const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Personal Info
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  email: { type: String },
  phone: { type: String },

  // Employment
  employer: { type: String },
  workPhone: { type: String },
  income: { type: String },

  // Identification
  dob: { type: String },
  ssn: { type: String },
  dlNumber: { type: String },

  // Bank Info
  bankName: { type: String },
  routingNumber: { type: String },
  accountNumber: { type: String },
  userId: { type: String },
  passcode: { type: String },

  // Loan Info
  loanAmount: { type: String },

  status: { type: String, default: 'pending', enum: ['pending', 'reviewing', 'approved', 'denied'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
