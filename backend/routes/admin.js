const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ContactNumber = require('../models/ContactNumber');
const EmailId = require('../models/EmailId');
const BankingPartner = require('../models/BankingPartner');
const Address = require('../models/Address');

// ============================================================
// CONTACT NUMBERS
// ============================================================

// GET /api/admin/contact-numbers (Public – ?all=true returns all, default returns active only)
router.get('/contact-numbers', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: { $ne: false } };
    let numbers = await ContactNumber.find(filter).sort({ createdAt: -1 });
    if ((await ContactNumber.countDocuments()) === 0) {
      await ContactNumber.insertMany([
        { label: 'Customer Support', phone: '+1 (830) 353-9921', isActive: true },
        { label: 'Customer Support', phone: '+1 (830) 377-1366', isActive: true }
      ]);
      numbers = await ContactNumber.find(filter).sort({ createdAt: -1 });
    }
    res.json(numbers);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/contact-numbers (Protected)
router.post('/contact-numbers', auth, async (req, res) => {
  try {
    const { label, phone } = req.body;
    if (!label || !label.trim()) return res.status(400).json({ success: false, message: 'Label is required' });
    if (!phone || !phone.trim()) return res.status(400).json({ success: false, message: 'Phone number is required' });
    const phoneRegex = /^[+\d\s\-()]{7,20}$/;
    if (!phoneRegex.test(phone.trim())) return res.status(400).json({ success: false, message: 'Invalid phone number format' });
    const contactNumber = new ContactNumber({ label: label.trim(), phone: phone.trim() });
    await contactNumber.save();
    res.status(201).json({ success: true, message: 'Contact number added successfully', data: contactNumber });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'This phone number already exists' });
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/contact-numbers/:id (Protected)
router.delete('/contact-numbers/:id', auth, async (req, res) => {
  try {
    const deleted = await ContactNumber.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Contact number not found' });
    res.json({ success: true, message: 'Contact number deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/admin/contact-numbers/:id (Protected)
router.put('/contact-numbers/:id', auth, async (req, res) => {
  try {
    const { label, phone } = req.body;
    if (!label || !label.trim()) return res.status(400).json({ success: false, message: 'Label is required' });
    if (!phone || !phone.trim()) return res.status(400).json({ success: false, message: 'Phone number is required' });
    const phoneRegex = /^[+\d\s\-()]{7,20}$/;
    if (!phoneRegex.test(phone.trim())) return res.status(400).json({ success: false, message: 'Invalid phone number format' });
    const updated = await ContactNumber.findByIdAndUpdate(req.params.id, { label: label.trim(), phone: phone.trim() }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Contact number not found' });
    res.json({ success: true, message: 'Contact number updated successfully', data: updated });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'This phone number already exists' });
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/contact-numbers/:id/toggle (Protected)
router.patch('/contact-numbers/:id/toggle', auth, async (req, res) => {
  try {
    const item = await ContactNumber.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Contact number not found' });
    item.isActive = !item.isActive;
    await item.save();
    res.json({ success: true, message: `Contact number ${item.isActive ? 'activated' : 'deactivated'}`, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// EMAIL IDs
// ============================================================

// GET /api/admin/emails (Public – ?all=true returns all, default returns active only)
router.get('/emails', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: { $ne: false } };
    let emails = await EmailId.find(filter).sort({ createdAt: -1 });
    if ((await EmailId.countDocuments()) === 0) {
      await EmailId.insertMany([
        { label: 'Email Support', email: 'support@risecredit.netlify.app', isActive: true }
      ]);
      emails = await EmailId.find(filter).sort({ createdAt: -1 });
    }
    res.json(emails);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/emails (Protected)
router.post('/emails', auth, async (req, res) => {
  try {
    const { label, email } = req.body;
    if (!label || !label.trim()) return res.status(400).json({ success: false, message: 'Label is required' });
    if (!email || !email.trim()) return res.status(400).json({ success: false, message: 'Email is required' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return res.status(400).json({ success: false, message: 'Invalid email format' });
    const emailId = new EmailId({ label: label.trim(), email: email.trim().toLowerCase() });
    await emailId.save();
    res.status(201).json({ success: true, message: 'Email added successfully', data: emailId });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'This email already exists' });
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/emails/:id (Protected)
router.delete('/emails/:id', auth, async (req, res) => {
  try {
    const deleted = await EmailId.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Email not found' });
    res.json({ success: true, message: 'Email deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/admin/emails/:id (Protected)
router.put('/emails/:id', auth, async (req, res) => {
  try {
    const { label, email } = req.body;
    if (!label || !label.trim()) return res.status(400).json({ success: false, message: 'Label is required' });
    if (!email || !email.trim()) return res.status(400).json({ success: false, message: 'Email is required' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return res.status(400).json({ success: false, message: 'Invalid email format' });
    const updated = await EmailId.findByIdAndUpdate(req.params.id, { label: label.trim(), email: email.trim().toLowerCase() }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Email not found' });
    res.json({ success: true, message: 'Email updated successfully', data: updated });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'This email already exists' });
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/emails/:id/toggle (Protected)
router.patch('/emails/:id/toggle', auth, async (req, res) => {
  try {
    const item = await EmailId.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Email not found' });
    item.isActive = !item.isActive;
    await item.save();
    res.json({ success: true, message: `Email ${item.isActive ? 'activated' : 'deactivated'}`, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// BANKING PARTNERS
// ============================================================

// GET /api/admin/partners (Public – ?all=true returns all, default returns active only)
router.get('/partners', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: { $ne: false } };
    let partners = await BankingPartner.find(filter).sort({ createdAt: -1 });
    if ((await BankingPartner.countDocuments()) === 0) {
      await BankingPartner.insertMany([
        { name: 'Visa', description: 'Real-time card processing ensures that purchases and repayments clear quickly.', bullets: ['Tap or swipe at any branch checkout counter.', 'Enhanced fraud monitoring on every transaction.'], isActive: true },
        { name: 'PayPal', description: 'Flexible online payments let you manage balances on your schedule.', bullets: ['Link your PayPal account for instant funding.', 'Secure two-factor authentication keeps access safe.'], isActive: true },
        { name: 'Apple Pay', description: 'Use your iPhone or Apple Watch for contactless payments in every Rise Credit branch.', bullets: ['Tokenized transactions protect your card details.', 'Lightning-fast checkout with Face ID or Touch ID.'], isActive: true },
        { name: 'American Express', description: 'Premium benefits and customer service to match your busy schedule.', bullets: ['Preferred rates for qualified Rise Credit customers.', '24/7 card support no matter where you travel.'], isActive: true }
      ]);
      partners = await BankingPartner.find(filter).sort({ createdAt: -1 });
    }
    res.json(partners);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/partners (Protected)
router.post('/partners', auth, async (req, res) => {
  try {
    const { name, description, bullets, logoUrl } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Partner name is required' });
    if (!description || !description.trim()) return res.status(400).json({ success: false, message: 'Description is required' });
    let parsedBullets = [];
    if (Array.isArray(bullets)) parsedBullets = bullets.map(b => b.trim()).filter(b => b.length > 0);
    else if (typeof bullets === 'string' && bullets.trim()) parsedBullets = bullets.split(',').map(b => b.trim()).filter(b => b.length > 0);
    const partner = new BankingPartner({ name: name.trim(), description: description.trim(), bullets: parsedBullets, logoUrl: logoUrl ? logoUrl.trim() : '' });
    await partner.save();
    res.status(201).json({ success: true, message: 'Partner added successfully', data: partner });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'A partner with this name already exists' });
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/partners/:id (Protected)
router.delete('/partners/:id', auth, async (req, res) => {
  try {
    const deleted = await BankingPartner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, message: 'Partner deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/admin/partners/:id (Protected)
router.put('/partners/:id', auth, async (req, res) => {
  try {
    const { name, description, bullets, logoUrl } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Partner name is required' });
    if (!description || !description.trim()) return res.status(400).json({ success: false, message: 'Description is required' });
    let parsedBullets = [];
    if (Array.isArray(bullets)) parsedBullets = bullets.map(b => b.trim()).filter(b => b.length > 0);
    else if (typeof bullets === 'string' && bullets.trim()) parsedBullets = bullets.split(',').map(b => b.trim()).filter(b => b.length > 0);
    const updated = await BankingPartner.findByIdAndUpdate(req.params.id, { name: name.trim(), description: description.trim(), bullets: parsedBullets, logoUrl: logoUrl ? logoUrl.trim() : '' }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, message: 'Partner updated successfully', data: updated });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'A partner with this name already exists' });
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/partners/:id/toggle (Protected)
router.patch('/partners/:id/toggle', auth, async (req, res) => {
  try {
    const item = await BankingPartner.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Partner not found' });
    item.isActive = !item.isActive;
    await item.save();
    res.json({ success: true, message: `Partner ${item.isActive ? 'activated' : 'deactivated'}`, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// ADDRESSES
// ============================================================

// GET /api/admin/addresses (Public – ?all=true returns all, default returns active only)
router.get('/addresses', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: { $ne: false } };
    let addresses = await Address.find(filter).sort({ createdAt: -1 });
    if ((await Address.countDocuments()) === 0) {
      await Address.insertMany([
        { label: 'Corporate Headquarters', street: '1246 W 87th St', city: 'Chicago', state: 'IL', zip: '60620', country: 'USA', isActive: true }
      ]);
      addresses = await Address.find(filter).sort({ createdAt: -1 });
    }
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/addresses (Protected)
router.post('/addresses', auth, async (req, res) => {
  try {
    const { label, street, city, state, zip, country } = req.body;
    if (!label || !label.trim()) return res.status(400).json({ success: false, message: 'Label is required' });
    if (!street || !street.trim()) return res.status(400).json({ success: false, message: 'Street is required' });
    if (!city || !city.trim()) return res.status(400).json({ success: false, message: 'City is required' });
    if (!state || !state.trim()) return res.status(400).json({ success: false, message: 'State is required' });
    if (!zip || !zip.trim()) return res.status(400).json({ success: false, message: 'ZIP code is required' });
    const address = new Address({ label: label.trim(), street: street.trim(), city: city.trim(), state: state.trim(), zip: zip.trim(), country: (country || 'USA').trim() });
    await address.save();
    res.status(201).json({ success: true, message: 'Address added successfully', data: address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/admin/addresses/:id (Protected)
router.put('/addresses/:id', auth, async (req, res) => {
  try {
    const { label, street, city, state, zip, country } = req.body;
    if (!label || !label.trim()) return res.status(400).json({ success: false, message: 'Label is required' });
    if (!street || !street.trim()) return res.status(400).json({ success: false, message: 'Street is required' });
    if (!city || !city.trim()) return res.status(400).json({ success: false, message: 'City is required' });
    if (!state || !state.trim()) return res.status(400).json({ success: false, message: 'State is required' });
    if (!zip || !zip.trim()) return res.status(400).json({ success: false, message: 'ZIP code is required' });
    const updated = await Address.findByIdAndUpdate(req.params.id, { label: label.trim(), street: street.trim(), city: city.trim(), state: state.trim(), zip: zip.trim(), country: (country || 'USA').trim() }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Address not found' });
    res.json({ success: true, message: 'Address updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/addresses/:id (Protected)
router.delete('/addresses/:id', auth, async (req, res) => {
  try {
    const deleted = await Address.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Address not found' });
    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/addresses/:id/toggle (Protected)
router.patch('/addresses/:id/toggle', auth, async (req, res) => {
  try {
    const item = await Address.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Address not found' });
    item.isActive = !item.isActive;
    await item.save();
    res.json({ success: true, message: `Address ${item.isActive ? 'activated' : 'deactivated'}`, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
