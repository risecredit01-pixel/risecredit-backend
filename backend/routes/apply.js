const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

const auth = require('../middleware/auth');

// POST /api/apply (Public)
router.post('/', async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    res.status(201).json({ success: true, message: 'Application submitted successfully!', id: application._id });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/apply (Protected)
router.get('/', auth, async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/apply/:id (Protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// DELETE /api/apply/:id (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Application.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Application not found' });
    


    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
