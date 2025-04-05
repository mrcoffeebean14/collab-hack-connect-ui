const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const Hackathon = require('../models/Hackathon');
const router = express.Router();

// Validation middleware
const hackathonValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('mode').isIn(['online', 'offline', 'hybrid']).withMessage('Invalid mode'),
  body('maxTeamSize').isInt({ min: 1 }).withMessage('Valid team size is required')
];

// Get all hackathons
router.get('/', async (req, res) => {
  try {
    const hackathons = await Hackathon.find()
      .populate('organizer', 'name username')
      .sort({ startDate: 1 });
    res.json({ hackathons });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get registered hackathons
router.get('/registered', auth, async (req, res) => {
  try {
    const hackathons = await Hackathon.find({
      'registrations.user': req.user._id
    }).populate('organizer', 'name username');
    res.json({ hackathons });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get organized hackathons
router.get('/organized', auth, async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ organizer: req.user._id });
    res.json({ hackathons });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create hackathon
router.post('/', auth, hackathonValidation, async (req, res) => {
  try {
    const hackathon = new Hackathon({
      ...req.body,
      organizer: req.user._id
    });
    await hackathon.save();
    res.status(201).json({ hackathon });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Register for hackathon
router.post('/:id/register', auth, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    // Check if already registered
    const existingRegistration = hackathon.registrations.find(
      reg => reg.user.toString() === req.user._id.toString()
    );

    if (existingRegistration) {
      return res.status(400).json({ error: 'Already registered' });
    }

    // Validate team size
    if (req.body.teamSize > hackathon.maxTeamSize) {
      return res.status(400).json({ error: 'Team size exceeds maximum limit' });
    }

    hackathon.registrations.push({
      user: req.user._id,
      teamName: req.body.teamName,
      teamSize: req.body.teamSize,
      projectIdea: req.body.projectIdea
    });

    await hackathon.save();
    res.json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update registration status
router.patch('/:hackathonId/registrations/:registrationId', auth, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.hackathonId);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    // Verify organizer
    if (hackathon.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const registration = hackathon.registrations.id(req.params.registrationId);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    registration.status = req.body.status;
    await hackathon.save();
    res.json({ message: 'Registration status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update hackathon
router.patch('/:id', auth, async (req, res) => {
  try {
    const hackathon = await Hackathon.findOne({
      _id: req.params.id,
      organizer: req.user._id
    });

    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    Object.assign(hackathon, req.body);
    await hackathon.save();
    res.json({ hackathon });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete hackathon
router.delete('/:id', auth, async (req, res) => {
  try {
    const hackathon = await Hackathon.findOneAndDelete({
      _id: req.params.id,
      organizer: req.user._id
    });

    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    res.json({ message: 'Hackathon deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 